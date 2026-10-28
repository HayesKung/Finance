import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// 草案没有访问控制。拒绝任何非回环监听。
const host = "127.0.0.1";
if (process.env.HOST && process.env.HOST !== host) {
  console.error("拒绝 HOST=" + process.env.HOST + "。鉴权落地前只监听 127.0.0.1。");
  process.exit(1);
}
process.env.HOST = host;
process.env.NITRO_HOST = host;
const port = Number(process.env.PORT || 4173);
process.env.PORT = String(port);
process.env.NITRO_PORT = String(port);

const LOOPBACK = new Set([
  "0100007F",
  "00000000000000000000000001000000",
]);

function listenersOn(portNumber) {
  const hexPort = portNumber.toString(16).toUpperCase().padStart(4, "0");
  const found = [];
  for (const file of ["/proc/net/tcp", "/proc/net/tcp6"]) {
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of text.split("\n").slice(1)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 4 || parts[3] !== "0A") continue;
      const [addr, p] = (parts[1] || "").split(":");
      if (p === hexPort && addr) found.push(addr);
    }
  }
  return found;
}

async function assertLoopback(portNumber) {
  if (!existsSync("/proc/net/tcp")) {
    console.error("读不到 /proc/net/tcp，无法确认监听地址，已退出。");
    process.exit(1);
  }
  for (let i = 0; i < 30; i++) {
    const found = listenersOn(portNumber);
    if (found.length) {
      const bad = found.filter((addr) => !LOOPBACK.has(addr));
      if (bad.length) {
        console.error("监听不在回环地址上: " + bad.join(", ") + "。已退出。");
        process.exit(1);
      }
      console.log("核对通过：端口 " + portNumber + " 只在回环地址。AuthProvider 不是访问控制。");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  console.error("没有看到端口 " + portNumber + " 的监听，已退出。");
  process.exit(1);
}

const candidates = ["dist/server/server.js", "dist/server/index.mjs", ".output/server/index.mjs"];
const hit = candidates
  .map((name) => new URL(name, import.meta.url))
  .find((url) => existsSync(fileURLToPath(url)));
if (!hit) {
  console.error("找不到构建产物。先运行 npm run build。");
  process.exit(1);
}

const mod = await import(hit);
const listensOnImport =
  hit.pathname.endsWith("/.output/server/index.mjs") || hit.pathname.endsWith("/dist/server/index.mjs");
if (!listensOnImport && typeof mod.fetch === "function") {
  const server = createServer(async (req, res) => {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value == null) continue;
      if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
      else headers.set(key, value);
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const method = req.method || "GET";
    const body = method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks);
    const response = await mod.fetch(
      new Request(`http://${host}:${port}${req.url || "/"}`, { method, headers, body }),
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  server.listen(port, host, () => {
    console.log(`http://${host}:${port} 仅本机。AuthProvider 不是访问控制。`);
    assertLoopback(port);
  });
} else {
  console.log(`已加载 ${fileURLToPath(hit)}。只允许 ${host}。AuthProvider 不是访问控制。`);
  await assertLoopback(port);
}