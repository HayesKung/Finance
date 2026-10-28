import type { ReactNode } from "react";

/**
 * 这不是访问控制。
 * 没有会话、没有身份、没有服务端校验。包一层只是因为根组件要有一个稳定的挂载点。
 * 真实鉴权落地之前，不要把这个进程放到公网、nginx 或防火墙开口后面。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return children;
}
