import { createServerFn } from "@tanstack/react-start";
import { methodReady, signatureOk, type PayMethod } from "@/lib/finpivot/agreement";
import {
  customerView,
  mergeStaffSave,
  tokenOk,
  type ContractPayload,
} from "@/lib/finpivot/contract-share";

const CHANNELS = new Set(["wechat", "alipay", "esign"]);

function asRecord(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("请求不正确");
  return data as Record<string, unknown>;
}

function asPayload(value: unknown): ContractPayload {
  if (!value || typeof value !== "object") throw new Error("确认书不正确");
  return value as ContractPayload;
}

async function sql() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

type ContractRow = {
  payload: string;
  customer_token: string;
  staff_token: string;
  expires_at: string | Date | null;
  revoked_at: string | Date | null;
};

function stamp(value: string | Date | null) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

async function readRow(token: string, column: "customer_token" | "staff_token") {
  const db = await sql();
  const rows = await db.query<ContractRow>(
    `select customer_token, staff_token, payload, expires_at, revoked_at from fin_contract where ${column} = $1`,
    [token],
  );
  return rows[0] ?? null;
}

async function guardCustomer(token: string, row: ContractRow | null) {
  const access = await import("@/lib/finpivot/access");
  const session = await import("@/lib/finpivot/session.server");
  const guard = await import("@/lib/finpivot/guard-db");
  const open = !!row && access.tokenOpen(stamp(row.expires_at), stamp(row.revoked_at), Date.now());
  if (open) return row;
  const bucket = `token:${session.clientIp()}`;
  if (!(await guard.rateOpen(bucket, access.TOKEN_MISS_LIMIT))) throw new Error("稍后再试");
  await guard.hitRate(bucket, access.TOKEN_MISS_LIMIT);
  await guard.audit("customer", "token-miss", token, false);
  return null;
}

export const publishContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const customerToken = String(row.customerToken ?? "");
    const staffToken = String(row.staffToken ?? "");
    if (!tokenOk(customerToken) || !tokenOk(staffToken) || customerToken === staffToken) throw new Error("链接无效");
    return { customerToken, staffToken, payload: asPayload(row.payload) };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const access = await import("@/lib/finpivot/access");
    const role = session.requireStaff("publish");
    const current = await readRow(data.customerToken, "customer_token");
    if (current && current.staff_token !== data.staffToken) throw new Error("链接无效");
    if (current && !access.tokenOpen(stamp(current.expires_at), stamp(current.revoked_at), Date.now())) throw new Error("链接已失效");
    const payload = mergeStaffSave(current ? asPayload(JSON.parse(current.payload)) : null, data.payload);
    const db = await sql();
    const expires = current ? stamp(current.expires_at) : access.tokenExpiry(Date.now());
    if (!current) {
      await db.query(
        "insert into fin_contract (customer_token, staff_token, payload, expires_at) values ($1, $2, $3, $4)",
        [data.customerToken, data.staffToken, JSON.stringify(payload), expires],
      );
    } else {
      await db.query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1", [
        data.customerToken,
        JSON.stringify(payload),
      ]);
    }
    const guard = await import("@/lib/finpivot/guard-db");
    await guard.audit(role ?? "support", "publish", data.customerToken, true);
    return { ok: true as const };
  });

export const readContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const token = String(asRecord(data).token ?? "");
    if (!tokenOk(token)) throw new Error("链接无效");
    return { token };
  })
  .handler(async ({ data }) => {
    const row = await guardCustomer(data.token, await readRow(data.token, "customer_token"));
    if (!row) return { payload: null };
    return { payload: customerView(asPayload(JSON.parse(row.payload))) };
  });

export const readStaffContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const token = String(asRecord(data).token ?? "");
    if (!tokenOk(token)) throw new Error("链接无效");
    return { token };
  })
  .handler(async ({ data }) => {
    const access = await import("@/lib/finpivot/access");
    const session = await import("@/lib/finpivot/session.server");
    session.requireStaff("readStaff");
    const row = await readRow(data.token, "staff_token");
    if (!row || !access.tokenOpen(stamp(row.expires_at), stamp(row.revoked_at), Date.now())) return { payload: null };
    return { payload: asPayload(JSON.parse(row.payload)) };
  });

export const customerSign = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const token = String(row.token ?? "");
    const name = String(row.name ?? "").trim();
    const image = String(row.image ?? "");
    if (!tokenOk(token) || !name || !signatureOk(image)) throw new Error("签名无效");
    return { token, name, image };
  })
  .handler(async ({ data }) => {
    const row = await guardCustomer(data.token, await readRow(data.token, "customer_token"));
    if (!row) throw new Error("没有这张确认书");
    const payload = asPayload(JSON.parse(row.payload));
    if (payload.signedAt) return { ok: true as const };
    payload.signedName = data.name;
    payload.signedImage = data.image;
    payload.signedAt = new Date().toISOString();
    const db = await sql();
    await db.query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1", [
      data.token,
      JSON.stringify(payload),
    ]);
    const guard = await import("@/lib/finpivot/guard-db");
    await guard.audit("customer", "sign", data.token, true);
    return { ok: true as const };
  });

export const customerClaim = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const token = String(row.token ?? "");
    const method = String(row.method ?? "");
    if (!tokenOk(token) || (method !== "微信" && method !== "支付宝" && method !== "银行转账")) throw new Error("方式无效");
    return { token, method: method as PayMethod };
  })
  .handler(async ({ data }) => {
    const row = await guardCustomer(data.token, await readRow(data.token, "customer_token"));
    if (!row) throw new Error("没有这张确认书");
    const payload = asPayload(JSON.parse(row.payload));
    if (!payload.signedAt || !payload.firmSignedAt || payload.claimedAt) return { ok: false as const };
    if (!methodReady(payload, data.method)) return { ok: false as const };
    payload.claimedMethod = data.method;
    payload.claimedAt = new Date().toISOString();
    const db = await sql();
    await db.query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1", [
      data.token,
      JSON.stringify(payload),
    ]);
    const guard = await import("@/lib/finpivot/guard-db");
    await guard.audit("customer", "claim", data.token, true);
    return { ok: true as const };
  });

export const revokeContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const token = String(asRecord(data).token ?? "");
    if (!tokenOk(token)) throw new Error("链接无效");
    return { token };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const role = session.requireStaff("revoke");
    const db = await sql();
    const rows = await db.query<{ customer_token: string }>(
      "update fin_contract set revoked_at = now(), updated_at = now() where customer_token = $1 and revoked_at is null returning customer_token",
      [data.token],
    );
    const guard = await import("@/lib/finpivot/guard-db");
    await guard.audit(role ?? "owner", "revoke", data.token, rows.length > 0);
    return { ok: rows.length > 0 };
  });

export const channelStatus = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  session.requireStaff("readStaff");
  const db = await sql();
  const rows = await db.query<{ id: string; secret: string }>("select id, secret from fin_channel");
  const access = await import("@/lib/finpivot/access");
  const set = new Set(rows.filter((row) => access.secretArmed(row.secret)).map((row) => row.id));
  return {
    wechat: set.has("wechat"),
    alipay: set.has("alipay"),
    esign: set.has("esign"),
  };
});

export const saveChannel = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const id = String(row.id ?? "");
    if (!CHANNELS.has(id)) throw new Error("通道不正确");
    return {
      id,
      appId: String(row.appId ?? "").trim().slice(0, 80),
      merchantId: String(row.merchantId ?? "").trim().slice(0, 80),
      secret: String(row.secret ?? "").trim().slice(0, 200),
    };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const access = await import("@/lib/finpivot/access");
    const role = session.requireStaff("saveChannel");
    if (!data.secret) throw new Error("密钥不能为空");
    const sealed = access.sealSecret(data.secret, session.dataKey());
    const db = await sql();
    await db.query(
      `insert into fin_channel (id, app_id, merchant_id, secret)
       values ($1, $2, $3, $4)
       on conflict (id) do update set app_id = excluded.app_id, merchant_id = excluded.merchant_id, secret = excluded.secret, updated_at = now()`,
      [data.id, data.appId, data.merchantId, sealed],
    );
    const guard = await import("@/lib/finpivot/guard-db");
    await guard.audit(role ?? "owner", "saveChannel", data.id, true);
    return { ok: true as const, armed: true };
  });
