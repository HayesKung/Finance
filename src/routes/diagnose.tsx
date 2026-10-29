import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, areaCls, inputCls } from "@/components/finpivot/frame";
import { IMPACTS } from "@/lib/finpivot/copy";
import { canon } from "@/lib/finpivot/glossary";
import { useI18n } from "@/lib/finpivot/locale";
import { askedLine } from "@/lib/finpivot/ui";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/diagnose")({ component: DiagnosePage });

function DiagnosePage() {
  const { locale, t, show, copy } = useI18n();
  const [copied, setCopied] = useState(false);
  const answers = useOs((s) => s.answers);
  const setAnswer = useOs((s) => s.setAnswer);
  const risks = useOs((s) => s.risks);
  const addRisk = useOs((s) => s.addRisk);
  const updateRisk = useOs((s) => s.updateRisk);
  const removeRisk = useOs((s) => s.removeRisk);
  const alias = useOs((s) => s.diagAlias);
  const setAlias = useOs((s) => s.setDiagAlias);
  const asked = copy.questionGroups.reduce((n, g) => n + g.items.filter((item) => answers[item.id]?.checked).length, 0);
  const total = copy.questionGroups.reduce((n, g) => n + g.items.length, 0);

  const markdown = useMemo(() => {
    const lines = [
      `# ${t("mdTitle")}`,
      `${t("mdAlias")}：${alias || t("mdUnset")}`,
      t("mdRule"),
      ``,
      `## ${t("mdAsked")}`,
    ];
    copy.questionGroups.forEach((g) => {
      lines.push(`### ${g.title}`);
      g.items.forEach((item) => {
        const a = answers[item.id];
        if (!a?.checked && !a?.note) return;
        lines.push(`- ${a?.checked ? t("mdAskedItem") : t("mdOpenItem")} ${item.text}`);
        if (a?.note) lines.push(`  ${t("mdRecord")}：${a.note}`);
      });
    });
    lines.push(``, `## ${t("mdRisks")}`);
    risks.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.point || t("mdEmpty")}｜${t("mdImpact")}：${show(r.impact)}｜${t("mdNext")}：${show(r.next)}`);
    });
    lines.push(``, copy.closeScript);
    return lines.join("\n");
  }, [alias, answers, risks, copy, show, t]);

  return (
    <Frame>
      <section className="grid items-center gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <Kicker n="04">{t("diagKicker")}</Kicker>
          <p className="max-w-xl text-lg leading-relaxed">{t("diagLede")}</p>
          <div className="mt-4">
            <Note>{t("diagNote")}</Note>
          </div>
        </div>
        <img src="/fin/export.jpg" alt={t("diagShotAlt")} className="shot border border-rule md:col-span-5" />
      </section>
      <div className="mt-6 max-w-md">
        <Field label={t("aliasLabel")}>
          <input className={inputCls} value={alias} onChange={(e) => setAlias(e.target.value)} placeholder={t("aliasPh")} />
        </Field>
      </div>
      <p className="mt-4 text-sm text-muted">{askedLine(locale, asked, total)}</p>
      <div className="mt-8 flex flex-col gap-8">
        {copy.questionGroups.map((g, gi) => (
          <section key={g.title}>
            <h3 className="font-serif text-xl">
              {gi + 1}. {g.title}
            </h3>
            <ul className="mt-3 border-t border-ink">
              {g.items.map((item) => {
                const a = answers[item.id] ?? { checked: false, note: "" };
                return (
                  <li key={item.id} className="border-b border-rule py-3">
                    <button type="button" onClick={() => setAnswer(item.id, { checked: !a.checked })} className="flex w-full items-start gap-3 text-left">
                      <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border text-xs ${a.checked ? "border-seal bg-seal text-seal-ink" : "border-rule"}`}>
                        {a.checked ? "✓" : ""}
                      </span>
                      <span className="text-sm leading-relaxed">{item.text}</span>
                    </button>
                    <textarea className={`${areaCls} mt-2`} placeholder={t("notePh")} value={a.note} onChange={(e) => setAnswer(item.id, { note: e.target.value })} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <Kicker n="07">{t("riskKicker")}</Kicker>
        <div className="flex flex-col gap-4">
          {risks.map((r, i) => (
            <div key={r.id} className="grid gap-2 border-b border-rule pb-4 md:grid-cols-12">
              <p className="font-serif text-seal md:col-span-1">{i + 1}</p>
              <div className="md:col-span-5">
                <Field label={t("riskPoint")}>
                  <input className={inputCls} value={r.point} onChange={(e) => updateRisk(r.id, { point: e.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label={t("impact")}>
                  <CanonSelect value={r.impact} options={IMPACTS} onChange={(value) => updateRisk(r.id, { impact: value as (typeof IMPACTS)[number] })} />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label={t("nextStep")}>
                  <input className={inputCls} value={show(r.next)} onChange={(e) => updateRisk(r.id, { next: canon(e.target.value) })} />
                </Field>
              </div>
              <div className="md:col-span-1 md:self-end">
                <Btn tone="paper" onClick={() => removeRisk(r.id)}>{t("removeShort")}</Btn>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Btn tone="paper" onClick={addRisk}>{t("addRisk")}</Btn>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">{t("closeTitle")}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed">{copy.closeScript}</p>
        <pre className="mt-4 overflow-x-auto border border-rule bg-paper-2 p-4 text-sm leading-relaxed whitespace-pre-wrap">{markdown}</pre>
        <div className="mt-3">
          <Btn
            onClick={() => {
              void navigator.clipboard.writeText(markdown).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              });
            }}
          >
            {copied ? t("copied") : t("copyList")}
          </Btn>
        </div>
      </section>
    </Frame>
  );
}
