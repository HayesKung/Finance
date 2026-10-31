import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { HOST, assetAlt, pages, renderPage } from "./markup.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "..", "..", "dist", "www");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file, acc);
    else acc.push(file);
  }
  return acc;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "en"), { recursive: true });
cpSync(join(root, "assets"), join(out, "assets"), { recursive: true });
cpSync(join(root, "assets", "favicon.svg"), join(out, "favicon.svg"));
writeFileSync(join(out, "styles.css"), readFileSync(join(root, "site.css")));
writeFileSync(join(out, "site.js"), readFileSync(join(root, "site.js")));
for (const page of pages) {
  writeFileSync(join(out, page.file), renderPage(page, "zh"));
  writeFileSync(join(out, "en", page.file), renderPage(page, "en"));
}

const urls = pages
  .filter((page) => page.file !== "404.html")
  .flatMap((page) => {
    const path = page.file === "index.html" ? "/" : `/${page.file}`;
    return [`  <url><loc>${HOST}${path}</loc></url>`, `  <url><loc>${HOST}/en${path}</loc></url>`];
  });
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${HOST}/sitemap.xml\n`);

const manifest = {
  generatedFor: "www.finanpivot.com",
  assets: walk(join(out, "assets"))
    .concat([join(out, "favicon.svg")])
    .map((file) => {
      const name = file.split(/[/\\]/).pop();
      return {
        path: relative(out, file).replaceAll("\\", "/"),
        source: "original",
        license: "Original graphic created for finanpivot.com. No third-party photograph or customer image.",
        sha256: sha256(file),
        alt: assetAlt[name] ?? "",
      };
    }),
};
writeFileSync(join(out, "assets-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const forbidden = ["DATABASE_URL", "FINANCE_SESSION_SECRET", "FINANCE_DATA_KEY", "BEGIN PRIVATE KEY", "fin_staff", "复式分录", "合同负债"];
for (const file of walk(out)) {
  if (!file.endsWith(".html") && !file.endsWith(".js") && !file.endsWith(".css") && !file.endsWith(".svg")) continue;
  const text = readFileSync(file, "utf8");
  for (const word of forbidden) {
    if (text.includes(word)) throw new Error(`forbidden token ${word} in ${file}`);
  }
}
const hash = createHash("sha256");
for (const file of walk(out).filter((file) => !file.endsWith("ARTIFACT_SHA256.txt")).sort()) {
  hash.update(relative(out, file).replaceAll("\\", "/"));
  hash.update(readFileSync(file));
}
const digest = hash.digest("hex");
writeFileSync(join(out, "ARTIFACT_SHA256.txt"), `${digest}\n`);
console.log(digest);
