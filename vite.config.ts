import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

// 只绑回环地址。这个草案没有访问控制，不要改成 0.0.0.0。
export default defineConfig(({ command }) => ({
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({ client: { entry: "./src/client.tsx" } }),
    ...(command === "build"
      ? [nitro({ preset: "node-server", serverDir: false })]
      : []),
    viteReact(),
  ],
}));
