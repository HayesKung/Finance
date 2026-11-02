import { randomUUID } from "node:crypto";
import type { Sql } from "../db.ts";
import { linesBalance, type JournalLine } from "./journal.ts";

const BANK = "银行存款";
const LIABILITY = "合同负债";

export type ReceiptInput = {
  role: "owner" | "support";
  claimIsCash: boolean;
  key: string;
  bankRef: string;
  receivableId: string;
  amountYuan: number;
  expectedYuan: number;
  actor: string;
};

type Decision =
  | { ok: false; reason: string }
  | { ok: true; cents: number; expectedCents: number; lines: JournalLine[] };

export function receiptDecision(input: ReceiptInput): Decision {
  if (input.claimIsCash) return { ok: false, reason: "客户申报不是到账。" };
  if (input.role !== "owner") return { ok: false, reason: "只有负责人能确认到账。" };
  if (!input.key.trim() || !input.receivableId.trim() || input.bankRef.trim().length < 4) {
    return { ok: false, reason: "缺少核销键。" };
  }
  if (!Number.isInteger(input.amountYuan) || !Number.isInteger(input.expectedYuan)) {
    return { ok: false, reason: "金额不符。" };
  }
  if (input.amountYuan <= 0 || input.amountYuan > input.expectedYuan) return { ok: false, reason: "金额不符。" };
  const cents = input.amountYuan * 100;
  const lines: JournalLine[] = [
    { account: BANK, side: "debit", amountCents: cents },
    { account: LIABILITY, side: "credit", amountCents: cents },
  ];
  if (!linesBalance(lines)) return { ok: false, reason: "借贷不平衡。" };
  return { ok: true, cents, expectedCents: input.expectedYuan * 100, lines };
}

function errorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) return String((error as { code?: unknown }).code);
  return "";
}

async function writeReceipt(
  query: Sql["query"],
  input: ReceiptInput,
  decision: Extract<Decision, { ok: true }>,
) {
  await query("select pg_advisory_xact_lock(hashtextextended($1, 0))", [input.receivableId]);
  const existing = await query<{ id: string }>("select id from fin_bank_receipt where idempotency_key = $1", [input.key]);
  if (existing.length > 0) {
    await query("insert into fin_audit (actor, action, resource_hash, ok) values ($1, 'confirmReceipt', $2, true)", [
      input.actor,
      input.key,
    ]);
    return { ok: true as const, duplicate: true, amountYuan: input.amountYuan };
  }
  const usedRows = await query<{ used: number }>(
    "select coalesce(sum(amount_cents), 0)::int as used from fin_bank_receipt where receivable_id = $1",
    [input.receivableId],
  );
  const used = Number(usedRows[0]?.used ?? 0);
  if (used + decision.cents > decision.expectedCents) return { ok: false as const, reason: "超过这一笔应收。" };
  const reused = await query<{ id: string }>("select id from fin_bank_receipt where bank_ref = $1", [input.bankRef]);
  if (reused.length > 0) return { ok: false as const, reason: "银行回单号已用过。" };
  const id = randomUUID();
  await query(
    `insert into fin_bank_receipt (id, idempotency_key, bank_ref, receivable_id, amount_cents, expected_cents, actor)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [id, input.key, input.bankRef, input.receivableId, decision.cents, decision.expectedCents, input.actor],
  );
  await query(
    `insert into fin_journal (id, idempotency_key, period, memo, body)
     values ($1, $2, $3, $4, $5)`,
    [randomUUID(), `receipt:${input.key}`, new Date().toISOString().slice(0, 7), "负责人确认到账", JSON.stringify(decision.lines)],
  );
  await query("insert into fin_audit (actor, action, resource_hash, ok) values ($1, 'confirmReceipt', $2, true)", [
    input.actor,
    input.key,
  ]);
  return { ok: true as const, duplicate: false, amountYuan: input.amountYuan };
}

export async function confirmOwnerReceipt(sql: Pick<Sql, "transaction">, input: ReceiptInput) {
  const decision = receiptDecision(input);
  if (!decision.ok) return decision;
  try {
    return await sql.transaction((query) => writeReceipt(query, input, decision));
  } catch (error) {
    const code = errorCode(error);
    if (code === "42P01") return { ok: false as const, reason: "账务表还没有迁移。" };
    console.error("confirmOwnerReceipt failed", code || "unknown");
    return { ok: false as const, reason: "到账没有记下。" };
  }
}
