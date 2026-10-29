import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { acceptProviderCallback, claimPostsCash, linesBalance, postEntry, receiptChange, reverseEntry } from "./journal.ts";

const open = { entries: [], locked: [] };

describe("double entry", () => {
  it("posts a balanced receipt and rejects an unbalanced or over-limit amount", () => {
    const posted = receiptChange(0, 500, 500);
    assert.equal(posted.ok, true);
    assert.equal(linesBalance(posted.lines), true);
    assert.equal(receiptChange(0, 501, 500).ok, false);
    assert.equal(receiptChange(0, 10.5, 500).ok, false);
    assert.equal(acceptProviderCallback().ok, false);
    assert.equal(claimPostsCash(), false);
  });

  it("treats the same idempotency key as one posting and refuses a second meaning", () => {
    const lines = receiptChange(0, 100, 100).lines;
    const first = postEntry(open, { id: "j1", key: "pay:p1:0:100", period: "2026-10", lines });
    assert.equal(first.ok, true);
    if (!first.ok) return;
    const again = postEntry(first.book, { id: "j2", key: "pay:p1:0:100", period: "2026-10", lines });
    assert.equal(again.ok && again.duplicate, true);
    const other = receiptChange(0, 80, 100).lines;
    const clash = postEntry(first.book, { id: "j3", key: "pay:p1:0:100", period: "2026-10", lines: other });
    assert.equal(clash.ok, false);
  });

  it("reverses by adding an opposite entry and leaves the original lines in place", () => {
    const lines = receiptChange(0, 200, 200).lines;
    const first = postEntry(open, { id: "j1", key: "pay:p1:0:200", period: "2026-10", lines });
    if (!first.ok) return;
    const locked = postEntry({ ...first.book, locked: ["2026-10"] }, { id: "j2", key: "pay:p2:0:50", period: "2026-10", lines: receiptChange(0, 50, 50).lines });
    assert.match(locked.ok ? "" : locked.reason, /锁定/);
    const reversed = reverseEntry(first.book, "j1", "回单金额写错，冲回", "j9", "rev:j1");
    assert.equal(reversed.ok, true);
    if (!reversed.ok) return;
    const original = reversed.book.entries.find((entry) => entry.id === "j1");
    assert.deepEqual(original?.lines, lines);
    assert.equal(reversed.book.entries.some((entry) => entry.reversesId === "j1"), true);
    assert.equal(reverseEntry(first.book, "j1", "太短", "j8", "rev:short").ok, false);
  });
});
