import { getCookie, getRequestIP, setCookie } from "@tanstack/react-start/server";
import { can, matchRole, readSession, signSession, SESSION_MS, type Role, type StaffAction } from "@/lib/finpivot/access";

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
  return process.env.FINANCE_DATA_KEY?.trim() || sessionSecret();
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
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSession() {
  setCookie(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export function roleForPassword(password: string): Role | null {
  return matchRole(password, process.env.FINANCE_OWNER_PASSWORD ?? "", process.env.FINANCE_SUPPORT_PASSWORD ?? "");
}
