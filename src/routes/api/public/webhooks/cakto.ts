import { createFileRoute } from "@tanstack/react-router";
import { verifyHmacSha256, upsertBuyer } from "@/lib/webhook-helpers.server";

const APPROVED_STATUSES = new Set(["paid", "approved", "completed", "purchase_approved"]);

export const Route = createFileRoute("/api/public/webhooks/cakto")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CAKTO_WEBHOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 500 });

        const signature = request.headers.get("x-cakto-signature") ?? request.headers.get("x-signature");
        const raw = await request.text();
        if (!verifyHmacSha256(raw, signature, secret)) {
          return new Response("invalid signature", { status: 401 });
        }

        let payload: any;
        try { payload = JSON.parse(raw); } catch { return new Response("invalid json", { status: 400 }); }

        const event = String(payload?.event ?? payload?.type ?? "").toLowerCase();
        const status = String(payload?.data?.status ?? payload?.status ?? "").toLowerCase();
        const email = payload?.data?.customer?.email ?? payload?.customer?.email ?? payload?.buyer?.email ?? payload?.email;
        const orderId = payload?.data?.id ?? payload?.id ?? null;

        const isApproved = APPROVED_STATUSES.has(status) || APPROVED_STATUSES.has(event);
        if (!isApproved) return Response.json({ ignored: true, status, event });
        if (!email) return new Response("missing email", { status: 400 });

        try {
          await upsertBuyer(email, "cakto", orderId ? String(orderId) : null);
        } catch (err) {
          console.error("cakto webhook insert error", err);
          return new Response("db error", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});