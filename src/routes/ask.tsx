import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Field, Frame, Kicker, Note, areaCls, inputCls } from "@/components/finpivot/frame";
import { INQUIRY_NEEDS, type InquiryNeed } from "@/lib/finpivot/inquiry";
import { useI18n } from "@/lib/finpivot/locale";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/ask")({ component: AskPage });

const NEED_KEY = {
  回款与结算: "askNeedPay",
  单证与退税: "askNeedDocs",
  项目结算: "askNeedProject",
  还不确定: "askNeedUnsure",
} as const;

function AskPage() {
  const { locale, t } = useI18n();
  const addInquiry = useOs((s) => s.addInquiry);
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contact, setContact] = useState("");
  const [market, setMarket] = useState("");
  const [need, setNeed] = useState<InquiryNeed>("还不确定");
  const [currency, setCurrency] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [warn, setWarn] = useState("");
  const [ref, setRef] = useState("");

  const submit = () => {
    if (!company.trim() || !contactName.trim() || !contact.trim() || !consent) {
      setWarn(t("askMissing"));
      return;
    }
    const saved = addInquiry({
      locale,
      company: company.trim(),
      contactName: contactName.trim(),
      contact: contact.trim(),
      market: market.trim(),
      need,
      currency: currency.trim().toUpperCase(),
      note: note.trim(),
    });
    setRef(saved.ref);
    setWarn("");
  };

  return (
    <Frame>
      <section className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <Kicker n="01">{t("askKicker")}</Kicker>
          <p className="max-w-xl text-lg leading-relaxed">{t("askLede")}</p>
          <div className="mt-4">
            <Note>{t("askNote")}</Note>
          </div>
        </div>
        <img src="/fin/settle.jpg" alt={t("shotSettleAlt")} className="shot border border-rule md:col-span-5" />
      </section>

      {ref ? (
        <section className="mt-8 max-w-xl border border-ink p-6">
          <p className="font-serif text-2xl">{t("askRefTitle")}</p>
          <p className="mt-4 font-serif text-3xl tracking-wide">{ref}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{t("askRefNext")}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Btn
              onClick={() => {
                setRef("");
                setConsent(false);
              }}
            >
              {t("askAgain")}
            </Btn>
            <Link to="/" className="inline-flex h-11 items-center justify-center border border-rule px-4 text-sm">
              {t("navHome")}
            </Link>
          </div>
        </section>
      ) : (
        <form
          className="mt-8 grid max-w-xl gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field label={t("askCompany")}>
            <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label={t("askName")}>
            <input className={inputCls} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </Field>
          <Field label={t("askReach")}>
            <input className={inputCls} value={contact} placeholder={t("askReachPh")} onChange={(e) => setContact(e.target.value)} />
          </Field>
          <Field label={t("askMarket")}>
            <input className={inputCls} value={market} onChange={(e) => setMarket(e.target.value)} />
          </Field>
          <Field label={t("askNeed")}>
            <select className={inputCls} value={need} onChange={(e) => setNeed(e.target.value as InquiryNeed)}>
              {INQUIRY_NEEDS.map((item) => (
                <option key={item} value={item}>
                  {t(NEED_KEY[item])}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("askCurrency")}>
            <input className={inputCls} value={currency} placeholder={t("askCurrencyPh")} onChange={(e) => setCurrency(e.target.value)} />
          </Field>
          <Field label={t("askNoteLabel")}>
            <textarea className={areaCls} value={note} placeholder={t("askNotePh")} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input className="mt-1 size-4 shrink-0" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t("askConsent")}</span>
          </label>
          {warn ? <p className="text-sm text-seal">{warn}</p> : null}
          <div>
            <Btn type="submit">{t("askSubmit")}</Btn>
          </div>
        </form>
      )}
    </Frame>
  );
}
