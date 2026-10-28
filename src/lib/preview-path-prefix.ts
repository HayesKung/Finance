import type { LocationRewrite } from "@tanstack/react-router";

/** 本地仓库没有预览路径前缀。函数留着，是因为路由入口会调用它。 */
export function previewPathRewrite(): LocationRewrite | undefined {
  return undefined;
}
