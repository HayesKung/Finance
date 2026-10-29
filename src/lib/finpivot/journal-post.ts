import { randomUUID } from "node:crypto";
import { moneyMoves, receiptChange } from "@/lib/finpivot/journal";

type Query = <T>(text: string, params?: readonly unknown[]) => Promise<T[]>;

const KEPT = new Set(["期间已锁定。", "同一幂等键不能记两笔不同的分录。", "金额不符。", "实收不能高于这一笔应收。", "借贷不平衡。"]);

function asPostError(error: unknown) {
  if (error instanceof Error && KEPT.has(error.message)) return error;
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
  if (code === "42P01") return new Error("账务表还没有迁移。");
  console.error("journal post failed", code || "unknown");
  return new Error("账务没有记下。");
}

export async function postMoneyMoves(
  query: Query,
  prev: { payments: { id: string; receivedYuan: number }[] },
  next: { payments: { id: string; receivedYuan: number; expectedYuan: number; reversalReason?: string }[] },
  now = new Date(),
) {
  const moves = moneyMoves(prev, next);
  if (moves.length === 0) return;
  const period = now.toISOString().slice(0, 7);
  try {
    const locked = await query<{ period: string }>("select period from fin_period where period = $1", [period]);
    if (locked.length > 0) throw new Error("期间已锁定。");
    for (const move of moves) {
      const change = receiptChange(move.fromYuan, move.toYuan, move.expectedYuan);
      if (!change.ok) throw new Error(change.reason);
      const key = `pay:${move.id}:${move.fromYuan}:${move.toYuan}`;
      const body = JSON.stringify(change.lines);
      const inserted = await query<{ id: string }>(
        `insert into fin_journal (id, idempotency_key, period, memo, body, reverses_id)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (idempotency_key) do nothing
         returning id`,
        [randomUUID(), key, period, move.reason || "核对实收", body, null],
      );
      if (inserted.length > 0) continue;
      const existing = await query<{ body: string }>("select body from fin_journal where idempotency_key = $1", [key]);
      if (existing[0]?.body !== body) throw new Error("同一幂等键不能记两笔不同的分录。");
    }
  } catch (error) {
    throw asPostError(error);
  }
}
