export type JournalSide = "debit" | "credit";

export type JournalLine = {
  account: string;
  side: JournalSide;
  amountCents: number;
};

export type StoredEntry = {
  id: string;
  key: string;
  period: string;
  lines: JournalLine[];
  reversesId?: string;
};

export type Book = {
  entries: StoredEntry[];
  locked: string[];
};

type MoveLine = {
  id: string;
  receivedYuan: number;
  expectedYuan: number;
  reversalReason?: string;
};

const BANK = "银行存款";
const LIABILITY = "合同负债";

export function linesBalance(lines: JournalLine[]) {
  if (lines.length < 2) return false;
  let debit = 0;
  let credit = 0;
  for (const line of lines) {
    if (line.side !== "debit" && line.side !== "credit") return false;
    if (!Number.isInteger(line.amountCents) || line.amountCents <= 0) return false;
    if (line.side === "debit") debit += line.amountCents;
    else credit += line.amountCents;
  }
  return debit === credit && debit > 0;
}

export function receiptChange(fromYuan: number, toYuan: number, expectedYuan: number) {
  if (!Number.isInteger(fromYuan) || !Number.isInteger(toYuan) || !Number.isInteger(expectedYuan)) {
    return { ok: false as const, reason: "金额不符。", lines: [] as JournalLine[] };
  }
  if (fromYuan < 0 || toYuan < 0) return { ok: false as const, reason: "金额不符。", lines: [] as JournalLine[] };
  if (toYuan > expectedYuan) return { ok: false as const, reason: "实收不能高于这一笔应收。", lines: [] as JournalLine[] };
  const delta = toYuan - fromYuan;
  if (delta === 0) return { ok: true as const, reason: "", lines: [] as JournalLine[] };
  const amountCents = Math.abs(delta) * 100;
  const lines: JournalLine[] =
    delta > 0
      ? [
          { account: BANK, side: "debit", amountCents },
          { account: LIABILITY, side: "credit", amountCents },
        ]
      : [
          { account: LIABILITY, side: "debit", amountCents },
          { account: BANK, side: "credit", amountCents },
        ];
  if (!linesBalance(lines)) return { ok: false as const, reason: "借贷不平衡。", lines: [] as JournalLine[] };
  return { ok: true as const, reason: "", lines };
}

export function moneyMoves(prev: { payments: { id: string; receivedYuan: number }[] }, next: { payments: MoveLine[] }) {
  const before = new Map(prev.payments.map((line) => [line.id, line.receivedYuan]));
  return next.payments.flatMap((line) => {
    const fromYuan = before.get(line.id) ?? 0;
    if (line.receivedYuan === fromYuan) return [];
    return [
      {
        id: line.id,
        fromYuan,
        toYuan: line.receivedYuan,
        expectedYuan: line.expectedYuan,
        reason: line.reversalReason?.trim() ?? "",
      },
    ];
  });
}

export function postEntry(
  book: Book,
  entry: { id: string; key: string; period: string; lines: JournalLine[]; reversesId?: string },
) {
  const existing = book.entries.find((item) => item.key === entry.key);
  if (existing) {
    if (JSON.stringify(existing.lines) === JSON.stringify(entry.lines)) return { ok: true as const, book, duplicate: true };
    return { ok: false as const, reason: "同一幂等键不能记两笔不同的分录。", book };
  }
  if (!linesBalance(entry.lines)) return { ok: false as const, reason: "借贷不平衡。", book };
  if (entry.period && book.locked.includes(entry.period)) return { ok: false as const, reason: "期间已锁定。", book };
  if (entry.reversesId && !book.entries.some((item) => item.id === entry.reversesId)) {
    return { ok: false as const, reason: "找不到要冲正的分录。", book };
  }
  const stored: StoredEntry = { ...entry };
  return { ok: true as const, book: { ...book, entries: [...book.entries, stored] }, duplicate: false };
}

export function reverseEntry(book: Book, entryId: string, reason: string, id: string, key: string) {
  if (reason.trim().length < 8) return { ok: false as const, reason: "冲正要写明原因。", book };
  const original = book.entries.find((item) => item.id === entryId);
  if (!original) return { ok: false as const, reason: "找不到要冲正的分录。", book };
  const lines = original.lines.map((line) => ({
    ...line,
    side: line.side === "debit" ? ("credit" as const) : ("debit" as const),
  }));
  const posted = postEntry(book, { id, key, period: original.period, lines, reversesId: original.id });
  if (!posted.ok) return posted;
  const kept = posted.book.entries.find((item) => item.id === entryId);
  if (!kept || JSON.stringify(kept.lines) !== JSON.stringify(original.lines)) {
    return { ok: false as const, reason: "原分录不能改写。", book };
  }
  return posted;
}

export function acceptProviderCallback() {
  return { ok: false as const, reason: "在线支付未接通，回调不能记实收。" };
}

export function claimPostsCash() {
  return false;
}
