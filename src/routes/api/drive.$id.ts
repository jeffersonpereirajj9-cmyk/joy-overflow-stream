import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

export const Route = createFileRoute("/api/drive/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const key = process.env.LOVABLE_API_KEY;
        const conn = process.env.GOOGLE_DRIVE_API_KEY;
        if (!key || !conn) {
          return new Response("Drive connector not configured", { status: 500 });
        }
        const url = new URL(request.url);
        const rawName = url.searchParams.get("name") || `${params.id}.mobi`;
        const filename = rawName.replace(/["\\\r\n]/g, "");

        const res = await fetch(`${GATEWAY}/files/${params.id}?alt=media`, {
          headers: {
            Authorization: `Bearer ${key}`,
            "X-Connection-Api-Key": conn,
          },
        });
        if (!res.ok || !res.body) {
          return new Response(`Drive fetch failed: ${res.status}`, { status: res.status });
        }
        return new Response(res.body, {
          status: 200,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, max-age=0",
          },
        });
      },
    },
  },
});