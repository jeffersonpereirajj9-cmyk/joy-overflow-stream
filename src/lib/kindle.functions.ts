import { createServerFn } from "@tanstack/react-start";

const RESEND_GW = "https://connector-gateway.lovable.dev/resend";

export const sendBookToKindle = createServerFn({ method: "POST" })
  .inputValidator((input: { filename: string; contentB64: string; kindleEmail: string }) => {
    if (!/^[^@\s]+@kindle\.com$/i.test(input.kindleEmail)) {
      throw new Error("E-mail Kindle inválido (deve terminar em @kindle.com)");
    }
    if (!input.contentB64) throw new Error("Arquivo EPUB ausente");
    if (!/\.epub$/i.test(input.filename)) throw new Error("Arquivo deve ser .epub");
    return input;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const lovKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovKey) throw new Error("LOVABLE_API_KEY ausente");
    if (!resendKey) throw new Error("RESEND_API_KEY ausente");

    const safeName = data.filename.replace(/["\\\r\n]/g, "");
    const baseName = safeName.replace(/\.epub$/i, "");

    // Send via Resend with EPUB attachment (already base64-encoded by client)
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
        attachments: [{ filename: safeName, content: data.contentB64 }],
      }),
    });
    if (!mailRes.ok) throw new Error(`Resend: ${await mailRes.text()}`);
    return { ok: true };
  });