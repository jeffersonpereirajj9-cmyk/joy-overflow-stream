import { createServerFn } from "@tanstack/react-start";

const DRIVE_GW = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const CC_BASE = "https://api.cloudconvert.com/v2";
const RESEND_GW = "https://connector-gateway.lovable.dev/resend";

type CCTask = {
  id: string;
  name: string;
  status: "waiting" | "processing" | "finished" | "error";
  result?: { files?: Array<{ url: string; filename: string }>; form?: { url: string; parameters: Record<string, string> } };
  message?: string;
};
type CCJob = { id: string; status: string; tasks: CCTask[] };

async function bufferToBase64(buf: ArrayBuffer): Promise<string> {
  // Chunked to avoid call-stack issues on large files
  const bytes = new Uint8Array(buf);
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export const sendBookToKindle = createServerFn({ method: "POST" })
  .inputValidator((input: { driveId: string; filename: string; kindleEmail: string }) => {
    if (!/^[^@\s]+@kindle\.com$/i.test(input.kindleEmail)) {
      throw new Error("E-mail Kindle inválido (deve terminar em @kindle.com)");
    }
    return input;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const lovKey = process.env.LOVABLE_API_KEY;
    const drvKey = process.env.GOOGLE_DRIVE_API_KEY;
    const ccKey = process.env.CLOUDCONVERT_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovKey || !drvKey) throw new Error("Drive não configurado");
    if (!ccKey) throw new Error("CLOUDCONVERT_API_KEY ausente");
    if (!resendKey) throw new Error("RESEND_API_KEY ausente");

    const baseName = data.filename.replace(/\.mobi$/i, "").replace(/["\\\r\n]/g, "");
    const epubName = `${baseName}.epub`;

    // 1. Download .mobi from Drive
    const drvRes = await fetch(`${DRIVE_GW}/files/${data.driveId}?alt=media`, {
      headers: { Authorization: `Bearer ${lovKey}`, "X-Connection-Api-Key": drvKey },
    });
    if (!drvRes.ok) throw new Error(`Drive falhou: ${drvRes.status}`);
    const mobiBlob = await drvRes.blob();

    // 2. Create CloudConvert job
    const jobBody = {
      tag: "bookfy-kindle",
      tasks: {
        "import-1": { operation: "import/upload" },
        "task-1": {
          operation: "convert",
          input_format: "mobi",
          output_format: "epub",
          input: "import-1",
          engine: "calibre",
        },
        "export-1": { operation: "export/url", input: "task-1", inline: false, archive_multiple_files: false },
      },
    };
    const jobRes = await fetch(`${CC_BASE}/jobs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${ccKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(jobBody),
    });
    if (!jobRes.ok) throw new Error(`CC job: ${await jobRes.text()}`);
    const job = (await jobRes.json()) as { data: CCJob };
    const form = job.data.tasks.find((t) => t.name === "import-1")?.result?.form;
    if (!form) throw new Error("CC import form ausente");

    // 3. Upload mobi
    const fd = new FormData();
    for (const [k, v] of Object.entries(form.parameters)) fd.append(k, v);
    fd.append("file", mobiBlob, data.filename);
    const upRes = await fetch(form.url, { method: "POST", body: fd });
    if (!upRes.ok && upRes.status !== 201) throw new Error(`CC upload: ${upRes.status}`);

    // 4. Poll
    let exportUrl: string | undefined;
    for (let i = 0; i < 90; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await fetch(`${CC_BASE}/jobs/${job.data.id}`, {
        headers: { Authorization: `Bearer ${ccKey}` },
      });
      if (!pollRes.ok) continue;
      const poll = (await pollRes.json()) as { data: CCJob };
      if (poll.data.status === "error") {
        const failed = poll.data.tasks.find((t) => t.status === "error");
        throw new Error(`CC erro: ${failed?.message ?? "desconhecido"}`);
      }
      if (poll.data.status === "finished") {
        exportUrl = poll.data.tasks.find((t) => t.name === "export-1")?.result?.files?.[0]?.url;
        break;
      }
    }
    if (!exportUrl) throw new Error("Conversão expirou");

    // 5. Fetch epub bytes
    const epubRes = await fetch(exportUrl);
    if (!epubRes.ok) throw new Error("Download do EPUB falhou");
    const epubBuf = await epubRes.arrayBuffer();
    const epubB64 = await bufferToBase64(epubBuf);

    // 6. Send via Resend
    const mailRes = await fetch(`${RESEND_GW}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "Bookfy <onboarding@resend.dev>",
        to: [data.kindleEmail],
        subject: baseName,
        text: `Enviando "${baseName}" para o seu Kindle.`,
        attachments: [{ filename: epubName, content: epubB64 }],
      }),
    });
    if (!mailRes.ok) throw new Error(`Resend: ${await mailRes.text()}`);
    return { ok: true };
  });