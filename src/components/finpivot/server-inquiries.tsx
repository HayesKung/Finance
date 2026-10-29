import { useEffect, useState } from "react";
import { Btn, Note } from "@/components/finpivot/frame";
import { inquiryToLead, type InquiryNeed, type InquiryStatus } from "@/lib/finpivot/inquiry";
import { listInquiries, markInquiry } from "@/lib/finpivot/inquiry-api";
import { useI18n } from "@/lib/finpivot/locale";
import { useOs } from "@/lib/finpivot/store";

type Row = {
  id: string;
  ref: string;
  company: string;
  contactName: string;
  contact: string;
  market: string;
  need: InquiryNeed;
  currency: string;
  note: string;
  status: InquiryStatus;
};

export function ServerInquiries() {
  const { t, show } = useI18n();
  const addLead = useOs((s) => s.addLead);
  const [rows, setRows] = useState<Row[]>([]);
  const [ready, setReady] = useState(true);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let stop = false;
    void listInquiries()
      .then((result) => {
        if (stop) return;
        setReady(result.ready);
        setRows(result.rows);
      })
      .catch(() => {
        if (!stop) setReady(false);
      });
    return () => {
      stop = true;
    };
  }, []);

  if (!ready) return <Note>{t("inqUnready")}</Note>;
  if (rows.length === 0) return error ? <Note>{error}</Note> : null;

  const mark = (row: Row, status: "已转入名单" | "不跟进") => {
    if (pending) return;
    setPending(row.id);
    void markInquiry({ data: { id: row.id, status } })
      .then(() => {
        if (status === "已转入名单") addLead(inquiryToLead(row));
        setRows((list) => list.map((item) => (item.id === row.id ? { ...item, status } : item)));
        setError("");
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "来询没有载入。");
      })
      .finally(() => setPending(""));
  };

  return (
    <ul className="mb-8 border-t border-ink">
      {error ? <li className="py-3 text-sm text-seal">{error}</li> : null}
      {rows.map((row) => (
        <li key={row.id} className="grid gap-3 border-b border-rule py-4 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <p className="font-serif text-xl">{row.ref}</p>
            <p className="mt-1 text-sm">
              {row.company} · {row.contactName} · {show(row.need)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {show(row.status)} · {row.contact}
            </p>
          </div>
          {row.status === "待处理" ? (
            <div className="flex flex-col gap-2 md:col-span-4 md:items-end">
              <Btn onClick={() => mark(row, "已转入名单")}>{t("inqAccept")}</Btn>
              <Btn tone="paper" onClick={() => mark(row, "不跟进")}>{t("inqDecline")}</Btn>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
