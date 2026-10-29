import { getCookie, getRequestHeader, getRequestIP, setCookie } from "@tanstack/react-start/server";
import { can, matchRole, readSession, resolveDataKey, sameOrigin, signSession, SESSION_MS, type Role, type StaffAction } from "@/lib/finpivot/access";

const COOKIE = "fin_staff";

export function sessionSecret() {
  return process.env.FINANCE_SESSION_SECRET?.trim() ?? "";
}

export function loginConfigured() {
  const secret = sessionSecret();
  const owner = process.env.FINANCE_OWNER_PASSWORD ?? "";
  const support = process.env.FINANCE_SUPPORT_PASSWORD ?? "";
  return secret.length >= 32 && (owner.length >= 10 || support.length >= 10);
}

export function dataKey() {
  const key = resolveDataKey(process.env.FINANCE_DATA_KEY);
  if (!key) throw new Error("数据密钥未配置");
  return key;
}

function headerValue(name: string) {
  return getRequestHeader(name) ?? "";
}

function requestHost() {
  if (process.env.FINANCE_TRUST_PROXY === "1") {
    const forwarded = headerValue("x-forwarded-host").split(",")[0]?.trim();
    if (forwarded) return forwarded;
  }
  return headerValue("host");
}

export function assertSameOrigin() {
  if (!sameOrigin(headerValue("origin"), requestHost())) throw new Error("来源不被接受");
}

function cookieSecure() {
  if (process.env.FINANCE_COOKIE_SECURE === "1") return true;
  if (process.env.FINANCE_COOKIE_SECURE === "0") return false;
  if (process.env.FINANCE_TRUST_PROXY === "1" && headerValue("x-forwarded-proto").split(",")[0]?.trim() === "https") return true;
  return process.env.NODE_ENV === "production";
}

export function currentRole(): Role | null {
  const secret = sessionSecret();
  if (secret.length < 32) return null;
  const raw = getCookie(COOKIE);
  if (!raw) return null;
  return readSession(raw, secret, Date.now());
}

export function requireStaff(action: StaffAction): Role {
  const role = currentRole();
  if (!role || !can(role, action)) throw new Error("没有权限");
  return role;
}

export function clientIp() {
  if (process.env.FINANCE_TRUST_PROXY === "1") return getRequestIP({ xForwardedFor: true }) ?? "unknown";
  return getRequestIP() ?? "unknown";
}

export function writeSession(role: Role) {
  const secret = sessionSecret();
  if (secret.length < 32) throw new Error("登录未配置");
  setCookie(COOKIE, signSession(role, Date.now() + SESSION_MS, secret), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
    secure: cookieSecure(),
  });
}

export function clearSession() {
  setCookie(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0, secure: cookieSecure() });
}

export function roleForPassword(password: string): Role | null {
  return matchRole(password, process.env.FINANCE_OWNER_PASSWORD ?? "", process.env.FINANCE_SUPPORT_PASSWORD ?? "");
}
