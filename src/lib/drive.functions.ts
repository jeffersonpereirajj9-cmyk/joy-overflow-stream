import { createServerFn } from "@tanstack/react-start";

const FOLDERS = [
  "1p-KoTGJLj6oAKXLFcCLkIgj4hwp5Tuev",
  "10tAJkQBA2voEE2CfS4HDs__9tEdVY4Ap",
];
const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const FOLDER_CACHE_MS = 5 * 60 * 1000;

let folderCache: { ids: string[]; expires: number } | null = null;

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

type DriveFile = { id: string; name: string; size?: string; mimeType?: string };

async function driveList(
  key: string,
  conn: string,
  params: URLSearchParams,
): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  const res = await fetch(`${GATEWAY}/files?${params}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      "X-Connection-Api-Key": conn,
    },
  });
  if (!res.ok) throw new Error(`Drive list failed: ${res.status}`);
  const json = (await res.json()) as { files?: DriveFile[]; nextPageToken?: string };
  return { files: json.files ?? [], nextPageToken: json.nextPageToken };
}

async function listChildFolders(key: string, conn: string, parentIds: string[]) {
  if (parentIds.length === 0) return [];
  const params = new URLSearchParams({
    q: `(${parentIds.map((f) => `'${f}' in parents`).join(" or ")}) and trashed = false and mimeType = '${FOLDER_MIME}'`,
    fields: "nextPageToken,files(id,name,mimeType)",
    pageSize: "1000",
    orderBy: "name",
  });
  const folders: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    if (pageToken) params.set("pageToken", pageToken);
    const page = await driveList(key, conn, params);
    folders.push(...page.files);
    pageToken = page.nextPageToken;
  } while (pageToken);
  return folders;
}

async function getSearchFolderIds(key: string, conn: string) {
  const now = Date.now();
  if (folderCache && folderCache.expires > now) return folderCache.ids;

  const seen = new Set(FOLDERS);
  const ids = [...FOLDERS];
  let frontier = [...FOLDERS];

  while (frontier.length > 0) {
    const next: string[] = [];
    for (let i = 0; i < frontier.length; i += 25) {
      const folders = await listChildFolders(key, conn, frontier.slice(i, i + 25));
      for (const folder of folders) {
        if (!seen.has(folder.id)) {
          seen.add(folder.id);
          ids.push(folder.id);
          next.push(folder.id);
        }
      }
    }
    frontier = next;
  }

  folderCache = { ids, expires: now + FOLDER_CACHE_MS };
  return ids;
}

export const listDriveBooks = createServerFn({ method: "GET" })
  .inputValidator((input: { pageToken?: string; search?: string }) => input)
  .handler(async ({ data }): Promise<{ files: DriveBook[]; nextPageToken?: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    const conn = process.env.GOOGLE_DRIVE_API_KEY;
    if (!key || !conn) throw new Error("Drive connector not configured");

    const search = (data.search ?? "").trim().replace(/'/g, "\\'");
    const folderIds = await getSearchFolderIds(key, conn);
    const qParts = [
      `(${folderIds.map((f) => `'${f}' in parents`).join(" or ")})`,
      "trashed = false",
      `mimeType != '${FOLDER_MIME}'`,
    ];
    if (search) qParts.push(`name contains '${search}'`);

    const params = new URLSearchParams({
      q: qParts.join(" and "),
      fields: "nextPageToken,files(id,name,size,mimeType)",
      pageSize: "1000",
      orderBy: "name",
    });
    if (data.pageToken) params.set("pageToken", data.pageToken);

    const json = await driveList(key, conn, params);
    return {
      files: json.files.map((f) => ({ id: f.id, name: f.name, size: Number(f.size ?? 0) })),
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
    const base = data.books.map((b) => {
      const stem = b.name.replace(/\.(mobi|epub|azw3?|pdf)$/i, "");
      const [titlePart, authorPart] = stem.split(/\s+-\s+/);
      return {
        id: b.id,
        title: (titlePart || stem).trim(),
        author: (authorPart || "Desconhecido").trim(),
        category: guessCategory(stem),
        synopsis: "",
      } as EnrichResult;
    });

    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { books: base };

    const synopses = await Promise.all(
      base.map(async (b) => {
        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um especialista em literatura romântica. Escreva uma sinopse envolvente em português (4 a 6 frases) do livro citado. Se não conhecer o livro, descreva de forma plausível pelo gênero. Responda apenas com a sinopse, sem prefixos.",
                },
                {
                  role: "user",
                  content: `Livro: "${b.title}"\nAutor: ${b.author}`,
                },
              ],
            }),
          });
          if (!res.ok) return "";
          const json = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          return json.choices?.[0]?.message?.content?.trim() ?? "";
        } catch {
          return "";
        }
      }),
    );

    return {
      books: base.map((b, i) => ({ ...b, synopsis: synopses[i] })),
    };
  });