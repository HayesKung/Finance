import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Sql } from "../db.ts";
import { confirmOwnerReceipt, type ReceiptInput } from "./receipt.ts";

type ReceiptRow = { key: string; bankRef: string; receivableId: string; amount: number };
type JournalRow = { key: string; body: string };

function memorySql() {
  const receipts: ReceiptRow[] = [];
  const journals: JournalRow[] = [];
  const audits: string[] = [];
  const query = (async (text: string, params: readonly unknown[] = []) => {
    if (text.startsWith("insert into fin_bank_receipt")) {
      receipts.push({
        key: String(params[1]),
        bankRef: String(params[2]),
        receivableId: String(params[3]),
        amount: Number(params[4]),
      });
      return [];
    }
    if (text.startsWith("insert into fin_journal")) {
      journals.push({ key: String(params[1]), body: String(params[4]) });
      return [];
    }
    if (text.startsWith("insert into fin_audit")) {
      audits.push(String(params[1]));
      return [];
    }
    if (text.startsWith("select pg_advisory")) return [];
    if (text.includes("where bank_ref")) {
      const found = receipts.find((row) => row.bankRef === params[0]);
      return found ? [{ id: found.key }] : [];
    }
    if (text.includes("where idempotency_key")) {
      const found = receipts.find((row) => row.key === params[0]);
      return found ? [{ id: found.key }] : [];
    }
    if (text.includes("sum(amount_cents)")) {
      const used = receipts.filter((row) => row.receivableId === params[0]).reduce((sum, row) => sum + row.amount, 0);
      return [{ used }];
    }
    throw new Error(`unexpected sql: ${text}`);
  }) as Sql["query"];
  return {
    receipts,
    journals,
    audits,
    async transaction<T>(run: (query: Sql["query"]) => Promise<T>) {
      const snapshot = { receipts: receipts.slice(), journals: journals.slice(), audits: audits.slice() };
      try {
        return await run(query);
      } catch (error) {
        receipts.splice(0, receipts.length, ...snapshot.receipts);
        journals.splice(0, journals.length, ...snapshot.journals);
        audits.splice(0, audits.length, ...snapshot.audits);
        throw error;
      }
    },
  };
}

function input(patch: Partial<ReceiptInput> = {}): ReceiptInput {
  return {
    role: "owner",
    claimIsCash: false,
    key: "bank-1",
    bankRef: "REF-1001",
    receivableId: "recv-1",
    amountYuan: 500,
    expectedYuan: 500,
    actor: "owner",
    ...patch,
  };
}

describe("bank receipt ledger", () => {
  it("stores one balanced receipt and ignores the same key", async () => {
    const sql = memorySql();
    const first = await confirmOwnerReceipt(sql, input());
    const second = await confirmOwnerReceipt(sql, input());
    assert.equal(first.ok && first.duplicate, false);
    assert.equal(second.ok && second.duplicate, true);
    assert.equal(sql.receipts.length, 1);
    assert.equal(sql.journals.length, 1);
    const lines = JSON.parse(sql.journals[0].body) as { account: string; side: string; amountCents: number }[];
    const debit = lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amountCents, 0);
    const credit = lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amountCents, 0);
    assert.equal(debit, credit);
    assert.equal(debit, 50000);
  });

  it("refuses support, a customer claim, and an over-allocation", async () => {
    const sql = memorySql();
    assert.match((await confirmOwnerReceipt(sql, input({ role: "support" }))).reason ?? "", /负责人/);
    assert.match((await confirmOwnerReceipt(sql, input({ claimIsCash: true }))).reason ?? "", /申报/);
    const partial = await confirmOwnerReceipt(sql, input({ key: "bank-2", bankRef: "REF-2002", amountYuan: 400, expectedYuan: 500 }));
    const extra = await confirmOwnerReceipt(sql, input({ key: "bank-3", bankRef: "REF-2003", amountYuan: 200, expectedYuan: 500 }));
    assert.equal(partial.ok, true);
    assert.match(extra.reason ?? "", /应收/);
    assert.equal(sql.receipts.length, 1);
    assert.equal(sql.journals.length, 1);
  });

  it("refuses a reused bank reference", async () => {
    const sql = memorySql();
    const first = await confirmOwnerReceipt(sql, input({ key: "bank-4", bankRef: "REF-9", amountYuan: 100, expectedYuan: 500 }));
    const again = await confirmOwnerReceipt(sql, input({ key: "bank-5", bankRef: "REF-9", amountYuan: 100, expectedYuan: 500 }));
    assert.equal(first.ok, true);
    assert.match(again.reason ?? "", /回单号/);
    assert.equal(sql.receipts.length, 1);
  });
});
