import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type Role = "owner" | "support";
export type StaffAction = "publish" | "readStaff" | "saveChannel" | "revoke" | "saveDesk" | "readDesk";

export const SESSION_MS = 12 * 60 * 60 * 1000;
export const TOKEN_MS = 14 * 24 * 60 * 60 * 1000;
export const LOGIN_LIMIT = 8;
export const TOKEN_MISS_LIMIT = 20;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

export function signSession(role: Role, exp: number, secret: string) {
  const body = `v1.${role}.${exp}`;
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(token: string, secret: string, now: number): Role | null {
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [version, role, expRaw, sig] = parts;
  if (version !== "v1" || (role !== "owner" && role !== "support")) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= now) return null;
  const expected = createHmac("sha256", secret).update(`v1.${role}.${expRaw}`).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  return role;
}

export function matchRole(password: string, owner: string, support: string): Role | null {
  if (password.length < 10) return null;
  if (owner.length >= 10 && safeEqual(password, owner)) return "owner";
  if (support.length >= 10 && safeEqual(password, support)) return "support";
  return null;
}

export function can(role: Role | null, action: StaffAction) {
  if (role !== "owner" && role !== "support") return false;
  if (action === "saveChannel" || action === "revoke") return role === "owner";
  return true;
}

export function tokenExpiry(now: number) {
  return new Date(now + TOKEN_MS).toISOString();
}

export function tokenOpen(expiresAt: string | null, revokedAt: string | null, now: number) {
  if (revokedAt) return false;
  if (!expiresAt) return false;
  const expiry = Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

export function nextRate(hits: number, windowStart: number, now: number, limit: number, windowMs: number) {
  if (now - windowStart >= windowMs) return { hits: 1, windowStart: now, blocked: false };
  const next = hits + 1;
  return { hits: next, windowStart, blocked: next > limit };
}

export function sealSecret(plain: string, keyMaterial: string) {
  const key = createHash("sha256").update(keyMaterial).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${enc.toString("base64url")}`;
}

export function openSecret(packed: string, keyMaterial: string) {
  const parts = packed.split(":");
  if (parts.length !== 5 || parts[0] !== "enc" || parts[1] !== "v1") return null;
  try {
    const key = createHash("sha256").update(keyMaterial).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(parts[2], "base64url"));
    decipher.setAuthTag(Buffer.from(parts[3], "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(parts[4], "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function secretArmed(stored: string) {
  return stored.trim().length > 0;
}

export function resourceHash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(createHash("sha256").update(left).digest(), createHash("sha256").update(right).digest());
}
