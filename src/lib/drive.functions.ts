import { createServerFn } from "@tanstack/react-start";

const FOLDER_A = "18BrkP6vLpnhi99thQNHxqNkBGMjVn0lw";
const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

export type DriveBook = {
  id: string;
  name: string;
  size: number;
};

export const listDriveBooks = createServerFn({ method: "GET" })
  .inputValidator((input: { pageToken?: string; search?: string }) => input)
  .handler(async ({ data }): Promise<{ files: DriveBook[]; nextPageToken?: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    const conn = process.env.GOOGLE_DRIVE_API_KEY;
    if (!key || !conn) throw new Error("Drive connector not configured");

    const search = (data.search ?? "").trim().replace(/'/g, "\\'");
    const qParts = [
      `'${FOLDER_A}' in parents`,
      "trashed = false",
      "mimeType = 'application/octet-stream'",
    ];
    if (search) qParts.push(`name contains '${search}'`);

    const params = new URLSearchParams({
      q: qParts.join(" and "),
      fields: "nextPageToken,files(id,name,size)",
      pageSize: "30",
      orderBy: "name",
    });
    if (data.pageToken) params.set("pageToken", data.pageToken);

    const res = await fetch(`${GATEWAY}/files?${params}`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "X-Connection-Api-Key": conn,
      },
    });
    if (!res.ok) throw new Error(`Drive list failed: ${res.status}`);
    const json = (await res.json()) as { files?: Array<{ id: string; name: string; size?: string }>; nextPageToken?: string };
    return {
      files: (json.files ?? []).map((f) => ({ id: f.id, name: f.name, size: Number(f.size ?? 0) })),
      nextPageToken: json.nextPageToken,
    };
  });