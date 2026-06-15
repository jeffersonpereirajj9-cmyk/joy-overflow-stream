import { createServerFn } from "@tanstack/react-start";

const CC_BASE = "https://api.cloudconvert.com/v2";

type CCTask = {
  id: string;
  name: string;
  status: "waiting" | "processing" | "finished" | "error";
  result?: { files?: Array<{ url: string; filename: string }> };
  message?: string;
};
type CCJob = { id: string; status: string; tasks: CCTask[] };

async function ccFetch<T>(path: string, init: RequestInit, key: string): Promise<T> {
  const res = await fetch(`${CC_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`CloudConvert ${path} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

async function waitJob(jobId: string, key: string): Promise<CCJob> {
  // Poll up to ~2min (mobi→epub usually <30s)
  for (let i = 0; i < 60; i++) {
    const { data } = await ccFetch<{ data: CCJob }>(`/jobs/${jobId}`, { method: "GET" }, key);
    if (data.status === "finished") return data;
    if (data.status === "error") {
      const failed = data.tasks.find((t) => t.status === "error");
      throw new Error(`CloudConvert job error: ${failed?.message ?? "unknown"}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("CloudConvert job timed out");
}

/**
 * Convert a remote .mobi (publicly fetchable URL) into a .epub via CloudConvert.
 * Returns a temporary CloudConvert URL hosting the resulting .epub.
 */
export const convertMobiToEpub = createServerFn({ method: "POST" })
  .inputValidator((input: { sourceUrl: string; filename?: string }) => input)
  .handler(async ({ data }): Promise<{ epubUrl: string; filename: string }> => {
    const key = process.env.CLOUDCONVERT_API_KEY;
    if (!key) throw new Error("CLOUDCONVERT_API_KEY not configured");

    const body = {
      tag: "bookfy-mobi-epub",
      tasks: {
        "import-1": { operation: "import/url", url: data.sourceUrl, filename: data.filename ?? "book.mobi" },
        "task-1": {
          operation: "convert",
          input_format: "mobi",
          output_format: "epub",
          input: "import-1",
          engine: "calibre",
        },
        "export-1": { operation: "export/url", input: "task-1", inline: false, archive_multiple_files: false },
      },
    };

    const created = await ccFetch<{ data: { id: string } }>(
      "/jobs",
      { method: "POST", body: JSON.stringify(body) },
      key,
    );
    const job = await waitJob(created.data.id, key);
    const exportTask = job.tasks.find((t) => t.name === "export-1");
    const file = exportTask?.result?.files?.[0];
    if (!file) throw new Error("CloudConvert did not return an exported file");
    return { epubUrl: file.url, filename: file.filename };
  });