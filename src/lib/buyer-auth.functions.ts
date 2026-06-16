import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkBuyerEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) =>
    z.object({ email: z.string().trim().toLowerCase().email().max(255) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("allowed_buyers")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { allowed: !!row, email: data.email };
  });