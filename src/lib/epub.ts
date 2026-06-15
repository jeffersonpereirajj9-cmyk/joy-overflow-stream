import JSZip from "jszip";
import type { Book } from "@/data/books";
import { sampleChapter } from "@/data/books";

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

export async function downloadEpub(book: Book) {
  const zip = new JSZip();
  const uuid = `bookfy-${book.id}`;
  const title = escapeXml(book.title);
  const author = escapeXml(book.author);

  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`,
  );

  const paragraphs = sampleChapter
    .split(/\n\n+/)
    .map((p) => `<p>${escapeXml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");

  zip.file(
    "OEBPS/chapter1.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title>
<style>body{font-family:Georgia,serif;line-height:1.7;padding:1em;}h1{text-align:center;}p{text-indent:1.5em;margin:0 0 1em;}</style>
</head><body><h1>${title}</h1><p style="text-align:center"><em>por ${author}</em></p>${paragraphs}<p style="text-align:center;color:#888;">— Fim da prévia —</p></body></html>`,
  );

  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${uuid}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>pt-BR</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().split(".")[0]}Z</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="c1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine><itemref idref="c1"/></spine>
</package>`,
  );

  zip.file(
    "OEBPS/nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Sumário</title></head>
<body><nav epub:type="toc"><h1>Sumário</h1><ol><li><a href="chapter1.xhtml">${title}</a></li></ol></nav></body></html>`,
  );

  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${book.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")}.epub`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}