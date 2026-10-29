export const PUBLIC_PATHS = ["/", "/ask", "/sign"] as const;
export const STAFF_PATHS = ["/os", "/clients", "/orders", "/pipeline", "/playbook", "/templates", "/diagnose"] as const;

export function signAccess(token: string) {
  return token.trim() ? ("remote" as const) : ("closed" as const);
}

export function pageAccess(path: string, role: "owner" | "support" | null) {
  if (path === "/staff/login") return "login" as const;
  if ((PUBLIC_PATHS as readonly string[]).includes(path)) return "public" as const;
  if ((STAFF_PATHS as readonly string[]).includes(path)) return role ? ("staff" as const) : ("login" as const);
  return "deny" as const;
}
