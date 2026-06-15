import { createServerFn } from "@tanstack/react-start";

const FOLDERS = [
  "1p-KoTGJLj6oAKXLFcCLkIgj4hwp5Tuev",
  "10tAJkQBA2voEE2CfS4HDs__9tEdVY4Ap",
];
const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

export type DriveBook = {
  id: string;
  name: string;
  size: number;
};

export const CATEGORIES = [
  "romance",
  "dark-romance",
  "mafia-romance",
  "bilionarios",
  "fantasia-romantica",
] as const;
export type DriveCategory = (typeof CATEGORIES)[number];

export type EnrichedBook = {
  id: string;
  name: string;
  size: number;
  title: string;
  author: string;
  category: DriveCategory;
  synopsis: string;
};

export const listDriveBooks = createServerFn({ method: "GET" })
  .inputValidator((input: { pageToken?: string; search?: string }) => input)
  .handler(async ({ data }): Promise<{ files: DriveBook[]; nextPageToken?: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    const conn = process.env.GOOGLE_DRIVE_API_KEY;
    if (!key || !conn) throw new Error("Drive connector not configured");

    const search = (data.search ?? "").trim().replace(/'/g, "\\'");
    const qParts = [
      `(${FOLDERS.map((f) => `'${f}' in parents`).join(" or ")})`,
      "trashed = false",
    ];
    if (search) qParts.push(`name contains '${search}'`);

    const params = new URLSearchParams({
      q: qParts.join(" and "),
      fields: "nextPageToken,files(id,name,size)",
      pageSize: "1000",
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

function guessCategory(name: string): DriveCategory {
  const n = name.toLowerCase();
  const has = (...words: string[]) => words.some((w) => n.includes(w));
  if (
    has(
      "mafia", "máfia", "mafioso", "bratva", "cartel", "cosa nostra",
      "padrinho", "don ", "famiglia", "famiglia", "yakuza",
    )
  )
    return "mafia-romance";
  if (
    has(
      "bilion", "bilhão", "ceo", "tycoon", "magnata", "boss", "billion",
      "executivo", "milion",
    )
  )
    return "bilionarios";
  if (
    has(
      "vampir", "lobo", "lobis", "alfa", "alpha", "ômega", "omega",
      "dragão", "dragao", "dragon", "bruxa", "bruxo", "fada", "fae",
      "feiti", "magia", "elfo", "fantas", "trono", "reino", "court of",
      "acotar", "rei ", "rainha", "deus", "deusa", "imortal", "vidente",
    )
  )
    return "fantasia-romantica";
  if (
    has(
      "dark", "cruel", "vingan", "sombri", "obsess", "punish", "tormento",
      "sangue", "ruína", "ruina", "veneno", "pecad", "ódio", "odio",
      "haunting", "twisted", "savage", "wicked", "ruthless",
    )
  )
    return "dark-romance";
  return "romance";
}

export type EnrichResult = {
  id: string;
  title: string;
  author: string;
  category: DriveCategory;
  synopsis: string;
};

export const enrichDriveBooks = createServerFn({ method: "POST" })
  .inputValidator((input: { books: { id: string; name: string }[] }) => input)
  .handler(async ({ data }): Promise<{ books: EnrichResult[] }> => {
    return {
      books: data.books.map((b) => {
        const base = b.name.replace(/\.(mobi|epub|azw3?|pdf)$/i, "");
        const [titlePart, authorPart] = base.split(/\s+-\s+/);
        return {
          id: b.id,
          title: (titlePart || base).trim(),
          author: (authorPart || "Desconhecido").trim(),
          category: guessCategory(base),
          synopsis: "",
        };
      }),
    };
  });