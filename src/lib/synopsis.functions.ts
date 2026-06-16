import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const expandSynopsis = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        title: z.string().min(1),
        author: z.string().min(1),
        category: z.string().optional(),
        current: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
    const provider = createLovableAiGatewayProvider(apiKey);
    const model = provider.chatModel("google/gemini-2.5-flash");
    const { text } = await generateText({
      model,
      temperature: 0.7,
      prompt: `Escreva uma sinopse envolvente em português brasileiro para o livro abaixo. Use de 3 a 4 parágrafos curtos separados por linha em branco, com tom literário, sem spoilers do final, sem listas, sem citações e sem dizer "neste livro" ou "o leitor". Não invente personagens que não existam.\n\nTítulo: ${data.title}\nAutor(a): ${data.author}\nCategoria: ${data.category ?? "ficção"}\nResumo curto existente (use como base): ${data.current ?? "—"}\n\nResponda apenas com a sinopse, sem título nem cabeçalhos.`,
    });
    return { synopsis: text.trim() };
  });