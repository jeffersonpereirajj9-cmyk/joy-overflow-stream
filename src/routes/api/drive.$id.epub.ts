import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const CC_BASE = "https://api.cloudconvert.com/v2";

type CCTask = {
  id: string;
  name: string;
  status: "waiting" | "processing" | "finished" | "error";
  result?: { files?: Array<{ url: string; filename: string }>; form?: { url: string; parameters: Record<string, string> } };
  message?: string;
};
type CCJob = { id: string; status: string; tasks: CCTask[] };

export const Route = createFileRoute("/api/drive/$id/epub")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const lovKey = process.env.LOVABLE_API_KEY;
        const drvKey = process.env.GOOGLE_DRIVE_API_KEY;
        const ccKey = process.env.CLOUDCONVERT_API_KEY;
        if (!lovKey || !drvKey) return new Response("Drive not configured", { status: 500 });
        if (!ccKey) return new Response("CLOUDCONVERT_API_KEY missing", { status: 500 });

        const url = new URL(request.url);
        const rawName = url.searchParams.get("name") || `${params.id}.mobi`;
        const baseName = rawName.replace(/\.mobi$/i, "").replace(/["\\\r\n]/g, "");
        const epubName = `${baseName}.epub`;

        // 1. Download .mobi from Drive
        const drvRes = await fetch(`${GATEWAY}/files/${params.id}?alt=media`, {
          headers: { Authorization: `Bearer ${lovKey}`, "X-Connection-Api-Key": drvKey },
        });
        if (!drvRes.ok) return new Response(`Drive fetch failed: ${drvRes.status}`, { status: 502 });
        const mobiBlob = await drvRes.blob();

        // 2. Create CloudConvert job
        const jobBody = {
          tag: "bookfy-mobi-epub",
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
        if (!jobRes.ok) return new Response(`CC job create failed: ${await jobRes.text()}`, { status: 502 });
        const job = (await jobRes.json()) as { data: CCJob };
        const importTask = job.data.tasks.find((t) => t.name === "import-1");
        const form = importTask?.result?.form;
        if (!form) return new Response("CC import form missing", { status: 502 });

        // 3. Upload .mobi bytes to CloudConvert's import URL
        const fd = new FormData();
        for (const [k, v] of Object.entries(form.parameters)) fd.append(k, v);
        fd.append("file", mobiBlob, rawName);
        const upRes = await fetch(form.url, { method: "POST", body: fd });
        if (!upRes.ok && upRes.status !== 201) {
          return new Response(`CC upload failed: ${upRes.status}`, { status: 502 });
        }

        // 4. Poll until finished
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
            return new Response(`CC error: ${failed?.message ?? "unknown"}`, { status: 502 });
          }
          if (poll.data.status === "finished") {
            const exp = poll.data.tasks.find((t) => t.name === "export-1");
            exportUrl = exp?.result?.files?.[0]?.url;
            break;
          }
        }
        if (!exportUrl) return new Response("CC conversion timed out", { status: 504 });

        // 5. Stream the resulting .epub to the client
        const epubRes = await fetch(exportUrl);
        if (!epubRes.ok || !epubRes.body) return new Response("CC download failed", { status: 502 });
        return new Response(epubRes.body, {
          status: 200,
          headers: {
            "Content-Type": "application/epub+zip",
            "Content-Disposition": `attachment; filename="${epubName}"`,
            "Cache-Control": "private, max-age=0",
          },
        });
      },
    },
  },
});