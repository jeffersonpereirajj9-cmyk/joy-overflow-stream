import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: process.uptime?.() ?? null,
        });
      },
    },
  },
});