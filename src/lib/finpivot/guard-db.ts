import { nextRate, RATE_WINDOW_MS, resourceHash } from "@/lib/finpivot/access";

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

export async function rateOpen(bucket: string, limit: number, now = Date.now()) {
  const sql = await db();
  const rows = await sql.query<{ hits: number; window_start: string | Date }>(
    "select hits, window_start from fin_rate where bucket = $1",
    [bucket],
  );
  const current = rows[0];
  if (!current) return true;
  const start = current.window_start instanceof Date ? current.window_start.getTime() : Date.parse(String(current.window_start));
  if (now - start >= RATE_WINDOW_MS) return true;
  return current.hits < limit;
}

export async function hitRate(bucket: string, limit: number, now = Date.now()) {
  const sql = await db();
  const rows = await sql.query<{ hits: number; window_start: string | Date }>(
    "select hits, window_start from fin_rate where bucket = $1",
    [bucket],
  );
  const current = rows[0];
  const start = current
    ? current.window_start instanceof Date
      ? current.window_start.getTime()
      : Date.parse(String(current.window_start))
    : now;
  const rate = nextRate(current?.hits ?? 0, Number.isFinite(start) ? start : now, now, limit, RATE_WINDOW_MS);
  await sql.query(
    `insert into fin_rate (bucket, hits, window_start) values ($1, $2, $3)
     on conflict (bucket) do update set hits = excluded.hits, window_start = excluded.window_start`,
    [bucket, rate.hits, new Date(rate.windowStart).toISOString()],
  );
  return rate.blocked;
}
