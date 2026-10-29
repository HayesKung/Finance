import { createServerFn } from "@tanstack/react-start";
import { acceptInquiryDraft, makeInquiryRef } from "@/lib/finpivot/inquiry";

function asRecord(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("请求不正确");
  return data as Record<string, unknown>;
}

function missingTable(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === "42P01");
}

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const draft = acceptInquiryDraft({
      company: String(row.company ?? ""),
      contactName: String(row.contactName ?? ""),
      contact: String(row.contact ?? ""),
      market: String(row.market ?? ""),
      need: String(row.need ?? ""),
      currency: String(row.currency ?? ""),
      note: String(row.note ?? ""),
      consent: row.consent === true,
    });
    if (!draft.ok) throw new Error(draft.reason);
    return { ...draft.value, locale: row.locale === "en" ? ("en" as const) : ("zh" as const) };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    const guard = await import("@/lib/finpivot/guard-db");
    const access = await import("@/lib/finpivot/access");
    session.assertSameOrigin();
    try {
      const attempt = await guard.consumeFailure(`inquiry:${session.clientIp()}`, access.LOGIN_LIMIT);
      if (attempt.blocked) throw new Error("稍后再试");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const id = crypto.randomUUID();
      const ref = makeInquiryRef(new Date().toISOString().slice(0, 10).replace(/-/g, ""), id);
      await sql.query(
        `insert into fin_inquiry
          (id, ref, locale, company, contact_name, contact, market, need, currency, note, consent_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())`,
        [id, ref, data.locale, data.company, data.contactName, data.contact, data.market, data.need, data.currency, data.note],
      );
      await guard.audit("public", "inquiry", id, true);
      return { ref };
    } catch (error) {
      if (error instanceof Error && error.message === "稍后再试") throw error;
      const code = error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code) : "";
      console.error("inquiry submit failed", code || "unknown");
      throw new Error("需求没有记下。");
    }
  });

export const listInquiries = createServerFn({ method: "POST" }).handler(async () => {
  const session = await import("@/lib/finpivot/session.server");
  session.requireStaff("readDesk");
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  try {
    const rows = await sql.query<{
      id: string;
      ref: string;
      created_at: string | Date;
      locale: "zh" | "en";
      company: string;
      contact_name: string;
      contact: string;
      market: string;
      need: "回款与结算" | "单证与退税" | "项目结算" | "还不确定";
      currency: string;
      note: string;
      status: "待处理" | "已转入名单" | "不跟进";
    }>(
      `select id, ref, created_at, locale, company, contact_name, contact, market, need, currency, note, status
       from fin_inquiry order by created_at desc limit 100`,
    );
    return {
      ready: true,
      rows: rows.map((row) => ({
        id: row.id,
        ref: row.ref,
        createdAt: new Date(row.created_at).toISOString(),
        locale: row.locale,
        company: row.company,
        contactName: row.contact_name,
        contact: row.contact,
        market: row.market,
        need: row.need,
        currency: row.currency,
        note: row.note,
        status: row.status,
      })),
    };
  } catch (error) {
    if (missingTable(error)) return { ready: false, rows: [] };
    throw new Error("来询没有载入。");
  }
});

export const markInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const row = asRecord(data);
    const id = String(row.id ?? "");
    const status = String(row.status ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("来询不正确");
    if (status !== "已转入名单" && status !== "不跟进") throw new Error("来询不正确");
    return { id, status: status as "已转入名单" | "不跟进" };
  })
  .handler(async ({ data }) => {
    const session = await import("@/lib/finpivot/session.server");
    session.assertSameOrigin();
    const role = session.requireStaff("saveDesk");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const guard = await import("@/lib/finpivot/guard-db");
    return sql.transaction(async (query) => {
      const rows = await query<{ id: string }>("update fin_inquiry set status = $2 where id = $1 and status = '待处理' returning id", [
        data.id,
        data.status,
      ]);
      if (!rows[0]) throw new Error("来询不正确");
      await guard.writeAudit(query, role, "inquiry", data.id, true);
      return { ok: true as const };
    });
  });
