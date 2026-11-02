import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import pg from "pg";
import type { Sql } from "../db.ts";
import { confirmOwnerReceipt } from "./receipt.ts";

const url = process.env.FINPIVOT_PG_URL;

describe("isolated postgres receipt", { skip: url ? false : "FINPIVOT_PG_URL is not set" }, () => {
  it("commits one receipt and does not double the journal", async () => {
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    const sql = {
      async transaction<T>(run: (query: Sql["query"]) => Promise<T>) {
        await client.query("begin");
        try {
          const value = await run(async (text, params = []) => {
            const result = await client.query(text, [...params]);
            return result.rows;
          });
          await client.query("commit");
          return value;
        } catch (error) {
          await client.query("rollback");
          throw error;
        }
      },
    };
    try {
      await client.query(readFileSync("migrations/0004_journal.sql", "utf8"));
      await client.query(`create table if not exists fin_audit (
        id bigserial primary key,
        at timestamptz not null default now(),
        actor text not null,
        action text not null,
        resource_hash text not null default '',
        ok boolean not null
      )`);
      await client.query(readFileSync("migrations/0006_receipt.sql", "utf8"));
      const row = {
        role: "owner" as const,
        claimIsCash: false,
        key: "synthetic-bank-1",
        bankRef: "SYN-800",
        receivableId: "synthetic-recv-1",
        amountYuan: 800,
        expectedYuan: 800,
        actor: "owner",
      };
      const first = await confirmOwnerReceipt(sql, row);
      const second = await confirmOwnerReceipt(sql, row);
      const support = await confirmOwnerReceipt(sql, { ...row, role: "support", key: "synthetic-bank-2" });
      const count = await client.query("select count(*)::int as n from fin_bank_receipt");
      const journal = await client.query("select body from fin_journal where idempotency_key = $1", ["receipt:synthetic-bank-1"]);
      assert.equal(first.ok && first.duplicate, false);
      assert.equal(second.ok && second.duplicate, true);
      assert.equal(support.ok, false);
      assert.equal(count.rows[0].n, 1);
      const lines = JSON.parse(journal.rows[0].body) as { side: string; amountCents: number }[];
      const debit = lines.find((line) => line.side === "debit")?.amountCents;
      const credit = lines.find((line) => line.side === "credit")?.amountCents;
      assert.equal(debit, 80000);
      assert.equal(credit, 80000);
      await client.query("insert into fin_provider_nonce (nonce) values ($1)", ["synthetic-nonce-1"]);
      let duplicate = false;
      try {
        await client.query("insert into fin_provider_nonce (nonce) values ($1)", ["synthetic-nonce-1"]);
      } catch (error) {
        duplicate = typeof error === "object" && error !== null && "code" in error && error.code === "23505";
      }
      assert.equal(duplicate, true);
    } finally {
      await client.end();
    }
  });
});
