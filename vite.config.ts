import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // TanStack Router 文件路由：自动从 src/routes 生成 routeTree.gen.ts
      router: { autoCodeSplitting: true },
    }),
  ],
});
