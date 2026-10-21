import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import "./build.mjs";

const root = path.resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".bib": "text/plain",
};
http
  .createServer(async (req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      res
        .writeHead(405, { "Content-Type": "text/plain", Allow: "GET, HEAD" })
        .end(
          "Form submissions require a Netlify deployment with form detection enabled.",
        );
      return;
    }
    try {
      const url = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = path.resolve(
        root,
        `.${url}${url.endsWith("/") ? "index.html" : ""}`,
      );
      if (!file.startsWith(`${root}${path.sep}`))
        throw new Error("Invalid path");
      const data = await fs.readFile(file);
      res
        .writeHead(200, {
          "Content-Type":
            types[path.extname(file)] || "application/octet-stream",
        })
        .end(req.method === "HEAD" ? undefined : data);
    } catch {
      res
        .writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        .end(await fs.readFile(`${root}/404.html`));
    }
  })
  .listen(4321, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:4321 (rebuild/restart after edits)"),
  );
