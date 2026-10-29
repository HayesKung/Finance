import { RATE_WINDOW_MS, resourceHash, takeFailure } from "@/lib/finpivot/access";

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

export async function audit(actor: string, action: string, resource: string, ok: boolean) {
  try {
    const sql = await db();
    await sql.query("insert into fin_audit (actor, action, resource_hash, ok) values ($1, $2, $3, $4)", [
      actor,
      action,
      resource ? resourceHash(resource) : "",
      ok,
    ]);
  } catch {
    return;
  }
}

type Query = <T>(text: string, params?: readonly unknown[]) => Promise<T[]>;

function windowStartMs(value: string | Date | undefined, now: number) {
  if (!value) return now;
  const start = value instanceof Date ? value.getTime() : Date.parse(String(value));
  return Number.isFinite(start) ? start : now;
}

export async function consumeFailure(bucket: string, limit: number, now = Date.now()) {
  const sql = await db();
  return sql.transaction(async (query) => {
    await query("select pg_advisory_xact_lock(hashtext($1))", [`rate:${bucket}`]);
    const rows = await query<{ hits: number; window_start: string | Date }>(
      "select hits, window_start from fin_rate where bucket = $1",
      [bucket],
    );
    const current = rows[0];
    const rate = takeFailure(current?.hits ?? 0, windowStartMs(current?.window_start, now), now, limit, RATE_WINDOW_MS);
    await query(
      `insert into fin_rate (bucket, hits, window_start) values ($1, $2, $3)
       on conflict (bucket) do update set hits = excluded.hits, window_start = excluded.window_start`,
      [bucket, rate.hits, new Date(rate.windowStart).toISOString()],
    );
    return rate;
  });
}

export async function writeAudit(query: Query, actor: string, action: string, resource: string, ok: boolean) {
  await query("insert into fin_audit (actor, action, resource_hash, ok) values ($1, $2, $3, $4)", [
    actor,
    action,
    resource ? resourceHash(resource) : "",
    ok,
  ]);
}
