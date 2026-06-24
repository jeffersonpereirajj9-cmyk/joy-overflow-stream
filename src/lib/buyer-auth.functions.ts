import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkBuyerEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) =>
    z.object({ email: z.string().trim().toLowerCase().email().max(255) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Reject banned emails outright.
    const { data: banned, error: bannedErr } = await supabaseAdmin
      .from("banned_emails")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();
    if (bannedErr) throw new Error(bannedErr.message);
    if (banned) return { allowed: false, email: data.email, banned: true };
    // Auto-allow: register the email so the owner can later confirm if it's a real buyer.
    const { error } = await supabaseAdmin
      .from("allowed_buyers")
      .upsert(
        { email: data.email, source: "auto_signup" },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
    return { allowed: true, email: data.email };
  });