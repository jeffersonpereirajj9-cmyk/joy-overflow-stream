import { createHmac, timingSafeEqual } from "crypto";

export function verifyHmacSha256(rawBody: string, signatureHex: string | null, secret: string): boolean {
  if (!signatureHex) return false;
  try {
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const sig = Buffer.from(signatureHex.replace(/^sha256=/, "").trim(), "hex");
    const exp = Buffer.from(expected, "hex");
    if (sig.length !== exp.length) return false;
    return timingSafeEqual(sig, exp);
  } catch {
    return false;
  }
}

export async function upsertBuyer(email: string, source: string, externalOrderId?: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw new Error("invalid email");
  }
  const { error } = await supabaseAdmin
    .from("allowed_buyers")
    .upsert(
      { email: clean, source, external_order_id: externalOrderId ?? null },
      { onConflict: "email" },
    );
  if (error) throw error;
  return { email: clean };
}