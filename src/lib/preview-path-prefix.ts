/**
 * 预览宿主路径前缀重写。
 *
 * 缺失来源：原仓库引用 `@/lib/preview-path-prefix` 但未提交实现。
 * 依据：`src/routes/__root.tsx` 里静态资源一律挂在 `/__grok/` 下
 * （manifest.webmanifest、icon-180.png），说明该应用在 Grok 预览容器里
 * 以子路径前缀部署。这里把该前缀剥掉，使 SSR 与客户端路由能正确匹配。
 *
 * 生产裸机部署（无前缀）时 PREVIEW_PATH_PREFIX 为空，行为退化为透传。
 */
const PREFIX = import.meta.env?.VITE_PREVIEW_PATH_PREFIX ?? "";

export function previewPathRewrite() {
  if (!PREFIX) return undefined;
  return {
    input: (pathname: string) =>
      pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) || "/" : pathname,
    output: (pathname: string) => `${PREFIX}${pathname}`,
  };
}
