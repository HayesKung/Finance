import { createServerFn } from "@tanstack/react-start";
import { methodReady, signatureOk, type PayMethod } from "@/lib/finpivot/agreement";
import {
  contractDigest,
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
  const attempt = await guard.consumeFailure(bucket, access.TOKEN_MISS_LIMIT);
  if (attempt.blocked) throw new Error("稍后再试");
  await guard.audit("customer", "token-miss", token, false);
  return null;
}

type Query = <T>(text: string, params?: readonly unknown[]) => Promise<T[]>;

async function lockedCustomer<T>(token: string, run: (query: Query, row: ContractRow) => Promise<T>) {
  const db = await sql();
  return db.transaction(async (query) => {
    const rows = await query<ContractRow>(
      "select customer_token, staff_token, payload, expires_at, revoked_at from fin_contract where customer_token = $1 for update",
      [token],
    );
    const row = rows[0];
    if (!row) return null;
    return run(query, row);
  });
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
    session.assertSameOrigin();
    const role = session.requireStaff("publish");
    const db = await sql();
    await db.transaction(async (query) => {
      await query("select pg_advisory_xact_lock(hashtext($1))", [data.customerToken]);
      const rows = await query<ContractRow>(
        "select customer_token, staff_token, payload, expires_at, revoked_at from fin_contract where customer_token = $1 for update",
        [data.customerToken],
      );
      const current = rows[0] ?? null;
      if (current && current.staff_token !== data.staffToken) throw new Error("链接无效");
      if (current && !access.tokenOpen(stamp(current.expires_at), stamp(current.revoked_at), Date.now())) {
        throw new Error("链接已失效");
      }
      const payload = mergeStaffSave(current ? asPayload(JSON.parse(current.payload)) : null, data.payload);
      if (payload.signedContentHash && payload.signedContentHash !== (await contractDigest(payload))) throw new Error("确认书版本已冻结。");
      const expires = current ? stamp(current.expires_at) : access.tokenExpiry(Date.now());
      if (!current) {
        await query("insert into fin_contract (customer_token, staff_token, payload, expires_at) values ($1, $2, $3, $4)", [
          data.customerToken,
          data.staffToken,
          JSON.stringify(payload),
          expires,
        ]);
      } else {
        await query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1", [
          data.customerToken,
          JSON.stringify(payload),
        ]);
      }
      const guard = await import("@/lib/finpivot/guard-db");
      await guard.writeAudit(query, role, "publish", data.customerToken, true);
    });
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
    const session = await import("@/lib/finpivot/session.server");
    session.assertSameOrigin();
    const row = await guardCustomer(data.token, await readRow(data.token, "customer_token"));
    if (!row) throw new Error("没有这张确认书");
    const saved = await lockedCustomer(data.token, async (query, locked) => {
      const access = await import("@/lib/finpivot/access");
      if (!access.tokenOpen(stamp(locked.expires_at), stamp(locked.revoked_at), Date.now())) return "closed" as const;
      const payload = asPayload(JSON.parse(locked.payload));
      if (payload.signedAt) return "signed" as const;
      payload.signedName = data.name;
      payload.signedImage = data.image;
      payload.signedAt = new Date().toISOString();
      payload.signedContentHash = await contractDigest(payload);
      await query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1 and revoked_at is null", [
        data.token,
        JSON.stringify(payload),
      ]);
      const guard = await import("@/lib/finpivot/guard-db");
      await guard.writeAudit(query, "customer", "sign", data.token, true);
      return "ok" as const;
    });
    if (saved !== "ok" && saved !== "signed") throw new Error("没有这张确认书");
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
    const session = await import("@/lib/finpivot/session.server");
    session.assertSameOrigin();
    const row = await guardCustomer(data.token, await readRow(data.token, "customer_token"));
    if (!row) throw new Error("没有这张确认书");
    const saved = await lockedCustomer(data.token, async (query, locked) => {
      const access = await import("@/lib/finpivot/access");
      if (!access.tokenOpen(stamp(locked.expires_at), stamp(locked.revoked_at), Date.now())) return "closed" as const;
      const payload = asPayload(JSON.parse(locked.payload));
      if (!payload.signedAt || !payload.firmSignedAt || payload.claimedAt) return "skip" as const;
      if (!methodReady(payload, data.method)) return "skip" as const;
      payload.claimedMethod = data.method;
      payload.claimedAt = new Date().toISOString();
      await query("update fin_contract set payload = $2, updated_at = now() where customer_token = $1 and revoked_at is null", [
        data.token,
        JSON.stringify(payload),
      ]);
      const guard = await import("@/lib/finpivot/guard-db");
      await guard.writeAudit(query, "customer", "claim", data.token, true);
      return "ok" as const;
    });
    return { ok: saved === "ok" };
  });

export const revokeContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const token = String(asRecord(data).token ?? "");
    if (!tokenOk(token)) throw new Error("链接无效");
    return { token };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    session.assertSameOrigin();
    const role = session.requireStaff("revoke");
    const db = await sql();
    const rows = await db.transaction(async (query) => {
      const updated = await query<{ customer_token: string }>(
        "update fin_contract set revoked_at = now(), updated_at = now() where customer_token = $1 and revoked_at is null returning customer_token",
        [data.token],
      );
      const guard = await import("@/lib/finpivot/guard-db");
      await guard.writeAudit(query, role, "revoke", data.token, updated.length > 0);
      return updated;
    });
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
    providerLive: false as const,
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
    session.assertSameOrigin();
    const role = session.requireStaff("saveChannel");
    if (!data.secret) throw new Error("密钥不能为空");
    const sealed = access.sealSecret(data.secret, session.dataKey());
    const db = await sql();
    await db.transaction(async (query) => {
      await query(
        `insert into fin_channel (id, app_id, merchant_id, secret)
         values ($1, $2, $3, $4)
         on conflict (id) do update set app_id = excluded.app_id, merchant_id = excluded.merchant_id, secret = excluded.secret, updated_at = now()`,
        [data.id, data.appId, data.merchantId, sealed],
      );
      const guard = await import("@/lib/finpivot/guard-db");
      await guard.writeAudit(query, role, "saveChannel", data.id, true);
    });
    return { ok: true as const, armed: true };
  });
