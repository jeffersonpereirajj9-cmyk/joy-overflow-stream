import { createFileRoute } from "@tanstack/react-router";
import { upsertBuyer, revokeBuyer, verifyBearerToken } from "@/lib/webhook-helpers.server";

const APPROVED = new Set([
  "approved", "paid", "payment_approved", "purchase_approved",
  "pagamento_aprovado", "aprovado", "completed",
]);
const REVOKED = new Set([
  "refunded", "chargeback", "payment_refunded", "estornado",
  "pagamento_estornado", "reembolsado",
]);

function pick(...vals: any[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export const Route = createFileRoute("/api/public/webhooks/wiapay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.WIAPAY_WEBHOOK_TOKEN;
        if (!token) return new Response("not configured", { status: 500 });

        const headerToken =
          request.headers.get("authorization") ??
          request.headers.get("x-webhook-token") ??
          request.headers.get("x-wiapay-token");

        if (!verifyBearerToken(headerToken, token)) {
          return new Response("invalid token", { status: 401 });
        }

        let payload: any;
        try { payload = await request.json(); } catch {
          return new Response("invalid json", { status: 400 });
        }

        const event = pick(
          payload?.event, payload?.type, payload?.status,
          payload?.data?.status, payload?.data?.event,
        ).toLowerCase();

        const email = pick(
          payload?.customer?.email,
          payload?.buyer?.email,
          payload?.data?.customer?.email,
          payload?.data?.buyer?.email,
          payload?.email,
        );

        const orderId = pick(
          payload?.transaction_id,
          payload?.transactionId,
          payload?.id,
          payload?.data?.id,
          payload?.data?.transaction_id,
        ) || null;

        if (!email) {
          console.warn("wiapay webhook missing email", { event });
          return Response.json({ ignored: true, reason: "missing email", event });
        }

        try {
          if (APPROVED.has(event)) {
            await upsertBuyer(email, "wiapay", orderId);
            return Response.json({ ok: true, action: "granted" });
          }
          if (REVOKED.has(event)) {
            await revokeBuyer(email);
            return Response.json({ ok: true, action: "revoked" });
          }
          return Response.json({ ignored: true, event });
        } catch (err) {
          console.error("wiapay webhook error", err);
          return new Response("db error", { status: 500 });
        }
      },
    },
  },
});