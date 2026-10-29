import { createServerFn } from "@tanstack/react-start";
import { diffDesk, parseDesk } from "@/lib/finpivot/ledger";

function asRecord(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("请求不正确");
  return data as Record<string, unknown>;
}

export const whoami = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  return { configured: session.loginConfigured(), role: session.currentRole() };
});

export const loginStaff = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({ password: String(asRecord(data).password ?? "") }))
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const guard = await import("@/lib/finpivot/guard-db");
    const access = await import("@/lib/finpivot/access");
    session.assertSameOrigin();
    if (!session.loginConfigured()) throw new Error("登录未配置");
    const bucket = `login:${session.clientIp()}`;
    const attempt = await guard.consumeFailure(bucket, access.LOGIN_LIMIT);
    if (attempt.blocked) throw new Error("稍后再试");
    const role = session.roleForPassword(data.password);
    if (!role) {
      await guard.audit("anonymous", "login", bucket, false);
      throw new Error("密码不正确");
    }
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await guard.writeAudit((text, params) => sql.query(text, params), role, "login", bucket, true);
    session.writeSession(role);
    return { role };
  });

export const logoutStaff = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  session.assertSameOrigin();
  const role = session.currentRole();
  session.clearSession();
  const guard = await import("@/lib/finpivot/guard-db");
  await guard.audit(role ?? "anonymous", "logout", "", true);
  return { ok: true as const };
});

export const deskHealth = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  session.requireStaff("readDesk");
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query("select 1 as ok");
    const cols = await sql.query<{ column_name: string }>(
      "select column_name from information_schema.columns where table_name = 'fin_contract' and column_name = 'expires_at'",
    );
    return { db: true, accessSchema: cols.length === 1 };
  } catch {
    return { db: false, accessSchema: false };
  }
});

export const loadDesk = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  session.requireStaff("readDesk");
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ version: number; body: string }>("select version, body from fin_desk where id = $1", ["firm"]);
  return rows[0] ?? { version: 0, body: "" };
});

export const saveDesk = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const version = Number(row.version);
    const body = String(row.body ?? "");
    if (!Number.isInteger(version) || version < 0 || body.length > 1_500_000) throw new Error("台账不正确");
    return { version, body };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const access = await import("@/lib/finpivot/access");
    session.assertSameOrigin();
    const role = session.requireStaff("saveDesk");
    const parsed = parseDesk(data.body);
    if (!parsed) throw new Error("台账不正确");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const key = access.resourceHash(`${data.version}:${data.body}`);
    const saved = await sql.transaction(async (query) => {
      await query("select pg_advisory_xact_lock(hashtext($1))", ["fin_desk"]);
      const seen = await query<{ key: string }>("insert into fin_idem (key) values ($1) on conflict do nothing returning key", [key]);
      const current = await query<{ version: number; body: string }>("select version, body from fin_desk where id = $1 for update", ["firm"]);
      if (seen.length === 0) {
        if (current[0]?.body === data.body) return { ok: true as const, version: current[0].version };
        throw new Error("这份台账已经保存过一次，请先重新载入。");
      }
      const have = current[0]?.version ?? 0;
      if (have !== data.version) throw new Error("台账已被另一边更新，请重新载入。");
      const prev = current[0] ? parseDesk(current[0].body) : { orders: [], payments: [], deliverables: [], agreements: [] };
      if (!prev) throw new Error("台账不正确");
      const move = diffDesk(prev, parsed, role);
      if (!move.ok) throw new Error(move.reason);
      const posting = await import("@/lib/finpivot/journal-post");
      const guard = await import("@/lib/finpivot/guard-db");
      await posting.postMoneyMoves(query, prev, parsed);
      const nextVersion = have + 1;
      await query(
        `insert into fin_desk (id, version, body) values ('firm', $1, $2)
         on conflict (id) do update set version = excluded.version, body = excluded.body, updated_at = now()`,
        [nextVersion, data.body],
      );
      await guard.writeAudit(query, role, "saveDesk", "firm", true);
      return { ok: true as const, version: nextVersion };
    });
    return saved;
  });
