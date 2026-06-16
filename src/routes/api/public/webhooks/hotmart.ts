import { createFileRoute } from "@tanstack/react-router";
import { upsertBuyer } from "@/lib/webhook-helpers.server";

const APPROVED_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);

export const Route = createFileRoute("/api/public/webhooks/hotmart")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.HOTMART_WEBHOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 500 });

        const hottok = request.headers.get("x-hotmart-hottok");
        if (!hottok || hottok !== secret) return new Response("invalid token", { status: 401 });

        let payload: any;
        try { payload = await request.json(); } catch { return new Response("invalid json", { status: 400 }); }

        const event = String(payload?.event ?? "").toUpperCase();
        const email = payload?.data?.buyer?.email ?? payload?.data?.customer?.email ?? payload?.buyer?.email;
        const orderId = payload?.data?.purchase?.transaction ?? payload?.data?.purchase?.order_id ?? null;

        if (!APPROVED_EVENTS.has(event)) return Response.json({ ignored: true, event });
        if (!email) return new Response("missing email", { status: 400 });

        try {
          await upsertBuyer(email, "hotmart", orderId ? String(orderId) : null);
        } catch (err) {
          console.error("hotmart webhook insert error", err);
          return new Response("db error", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});