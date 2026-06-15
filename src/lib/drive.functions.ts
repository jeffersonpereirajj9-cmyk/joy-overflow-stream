import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

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

const EnrichSchema = z.object({
  books: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      author: z.string(),
      category: z.enum(CATEGORIES),
      synopsis: z.string(),
    }),
  ),
});

export const enrichDriveBooks = createServerFn({ method: "POST" })
  .inputValidator((input: { books: { id: string; name: string }[] }) => input)
  .handler(async ({ data }): Promise<{ books: z.infer<typeof EnrichSchema>["books"] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    if (data.books.length === 0) return { books: [] };

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const list = data.books
      .map((b) => `- id=${b.id} | arquivo="${b.name.replace(/\.mobi$/i, "")}"`)
      .join("\n");

    const prompt = `Você é curador da Bookfy, biblioteca digital para mulheres apaixonadas por romance e dark romance.
Para cada livro abaixo (id + nome do arquivo "Título - Autor"), retorne:
- title: título limpo
- author: autor (ou "Desconhecido")
- category: UMA destas exatas: romance, dark-romance, mafia-romance, bilionarios, fantasia-romantica.
  Use seu conhecimento da obra. Se não for romance, escolha a categoria mais próxima (romance por padrão).
- synopsis: 2-3 frases envolventes em português, tom feminino e sedutor.

Livros:
${list}

Retorne JSON com a chave "books" preservando exatamente os mesmos ids.`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: EnrichSchema }),
        prompt,
      });
      return { books: output.books };
    } catch (err) {
      const status = (err as { statusCode?: number; status?: number })?.statusCode
        ?? (err as { status?: number })?.status;
      console.error("[enrichDriveBooks] AI gateway error", status, err);
      // Graceful fallback: return minimal entries derived from the filename
      // so the UI keeps working even when credits/rate limits hit.
      return {
        books: data.books.map((b) => {
          const base = b.name.replace(/\.mobi$/i, "");
          const [titlePart, authorPart] = base.split(/\s+-\s+/);
          return {
            id: b.id,
            title: (titlePart || base).trim(),
            author: (authorPart || "Desconhecido").trim(),
            category: "romance" as const,
            synopsis: "",
          };
        }),
      };
    }
  });