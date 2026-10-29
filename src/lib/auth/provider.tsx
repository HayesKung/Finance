import type { ReactNode } from "react";

/**
 * 根组件上的这层仍然不是访问控制。
 * 内部页的登录在 fin_staff cookie，见 src/lib/finpivot/session.server.ts。
 * 没配置口令时，内部页关闭，不会退回成无登录工作台。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return children;
}
