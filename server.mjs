/**
 * Finance desk 生产运行时入口（部署侧补齐）。
 *
 * 缺失来源：TanStack Start 的构建产物 dist/server/server.js 只导出一个
 * Web Fetch 形态的 handler `{ fetch }`，自身不监听端口。原仓库没有提供
 * 任何 HTTP 启动器，因此这里用 node:http 做一层薄适配并静态托管 dist/client。
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import handler from "./dist/server/server.js";

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOSTNAME || "0.0.0.0";
const CLIENT_DIR = resolve("dist/client");

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

async function serveStatic(req, res, pathname) {
  let rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  if (rel === "/" || rel === "\\") rel = "/index.html";
  const file = join(CLIENT_DIR, rel);
  if (!file.startsWith(CLIENT_DIR)) return false; // 目录穿越防护
  try {
    const st = await stat(file);
    if (!st.isFile()) return false;
    res.writeHead(200, {
      "content-type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "content-length": st.size,
      "cache-control": rel.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=300",
    });
    createReadStream(file).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const pathname = (req.url || "/").split("?")[0];
  const hasAssetExt = /\.[a-zA-Z0-9]+$/.test(pathname);

  // 静态资源与 public/ 下的文件先行，避免打进 SSR 管线
  if (hasAssetExt && (await serveStatic(req, res, pathname))) return;

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`);
    const init = { method: req.method, headers: req.headers };
    if (req.method !== "GET" && req.method !== "HEAD") {
      // @ts-ignore Node 22: Readable -> web stream
      init.body = req;
      init.duplex = "half";
    }
    const response = await handler.fetch(new Request(url, init));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (!response.body) {
      res.end();
      return;
    }
    // @ts-ignore Node 22 ReadableStream piping
    for await (const chunk of response.body) res.write(chunk);
    res.end();
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`finance-desk upstream error: ${err?.message || err}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`finance-desk listening on http://${HOST}:${PORT}`);
});
