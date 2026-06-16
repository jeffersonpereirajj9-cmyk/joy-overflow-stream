import { createFileRoute } from "@tanstack/react-router";
import { verifyHmacSha256, upsertBuyer } from "@/lib/webhook-helpers.server";

const APPROVED_STATUSES = new Set(["paid", "approved", "order_approved", "order_paid"]);

export const Route = createFileRoute("/api/public/webhooks/kiwify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.KIWIFY_WEBHOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 500 });

        const url = new URL(request.url);
        const signature = url.searchParams.get("signature") ?? request.headers.get("x-kiwify-signature");
        const raw = await request.text();
        if (!verifyHmacSha256(raw, signature, secret)) {
          return new Response("invalid signature", { status: 401 });
        }

        let payload: any;
        try { payload = JSON.parse(raw); } catch { return new Response("invalid json", { status: 400 }); }

        const status = String(payload?.order_status ?? payload?.status ?? "").toLowerCase();
        const email = payload?.Customer?.email ?? payload?.customer?.email ?? payload?.buyer?.email ?? payload?.email;
        const orderId = payload?.order_id ?? payload?.id ?? null;

        if (!APPROVED_STATUSES.has(status)) return Response.json({ ignored: true, status });
        if (!email) return new Response("missing email", { status: 400 });

        try {
          await upsertBuyer(email, "kiwify", orderId ? String(orderId) : null);
        } catch (err) {
          console.error("kiwify webhook insert error", err);
          return new Response("db error", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});