/**
 * STUB — 来源缺失：原仓库引用 `@/lib/auth/provider` 但未提供实现。
 *
 * 当前页面(see src/routes/*)没有消费任何 auth hook，因此这里只做透传容器，
 * 以保证图表/作战台可编译上线。真实登录态、角色(owner/reviewer)与权限边界
 * 需要负责人确认后再替换实现，不得在此静默加出一套自造鉴权。
 */
import { type ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
