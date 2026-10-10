const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, "dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const resolvedPath = path.resolve(publicDirectory, relativePath);

  if (!resolvedPath.startsWith(`${publicDirectory}${path.sep}`)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(request.url || "/");
  } catch {
    response.writeHead(400);
    response.end("Bad Request");
    return;
  }

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    const requestedFile = !statError && stats.isFile() ? filePath : path.join(publicDirectory, "index.html");
    const contentType = mimeTypes[path.extname(requestedFile).toLowerCase()] || "application/octet-stream";

    fs.readFile(requestedFile, (readError, contents) => {
      if (readError) {
        response.writeHead(404);
        response.end("Not Found");
        return;
      }

      response.writeHead(200, {
        "Cache-Control": requestedFile.endsWith("index.html")
          ? "no-cache"
          : "public, max-age=31536000, immutable",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff"
      });

      if (request.method === "HEAD") {
        response.end();
        return;
      }

      response.end(contents);
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Zaiveriq coming-soon server listening on port ${port}`);
});
