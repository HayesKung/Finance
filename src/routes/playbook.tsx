import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Frame, Kicker, Note } from "@/components/finpivot/frame";
import { useI18n } from "@/lib/finpivot/locale";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/playbook")({ component: PlaybookPage });

function PlaybookPage() {
  const { t, show, copy } = useI18n();
  const checked = useOs((s) => s.articleChecked);
  const toggle = useOs((s) => s.toggleArticle);
  const [copied, setCopied] = useState("");

  const copyText = (id: string, text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      window.setTimeout(() => setCopied(""), 1400);
    });
  };

  return (
    <Frame>
      <Kicker n="07">{t("playKicker")}</Kicker>
      <Note>{t("playNote")}</Note>

      <div className="ledger mt-6">
        {copy.channels.map((c) => (
          <div key={c.rank} className="ledger-row md:grid-cols-4">
            <p className="font-serif">{c.rank}</p>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm leading-relaxed">{c.how}</p>
            <p className="text-sm text-seal">{c.goal}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h3 className="font-serif text-xl">{t("scriptsTitle")}</h3>
        <div className="mt-4 grid gap-4">
          {copy.scripts.map((s) => (
            <article key={s.scene} className="border border-rule p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{show(s.scene)}</p>
                <Btn tone="paper" onClick={() => copyText(s.scene, s.text)}>
                  {copied === s.scene ? t("copied") : t("copy")}
                </Btn>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
            </article>
          ))}
        </div>
        <article className="mt-4 border border-ink p-4">
          <p className="font-medium">{t("partnerTitle")}</p>
          <p className="mt-2 text-sm leading-relaxed">{copy.partnerLine}</p>
        </article>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">{t("weeksTitle")}</h3>
        <p className="mt-2 text-sm text-muted">{t("weeksNote")}</p>
        <div className="mt-4 grid gap-4">
          {copy.weeks.map((w) => (
            <article key={w.week} className="border-t border-ink pt-3">
              <p className="font-serif text-lg">{w.week}</p>
              <dl className="mt-2 grid gap-2 text-sm md:grid-cols-2">
                <div><dt className="text-muted">{t("content2")}</dt><dd>{w.content}</dd></div>
                <div><dt className="text-muted">{t("qa")}</dt><dd>{w.qa}</dd></div>
                <div><dt className="text-muted">{t("outreach")}</dt><dd>{w.outreach}</dd></div>
                <div><dt className="text-muted">{t("partnerCol")}</dt><dd>{w.partner}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">{t("topicsTitle")}</h3>
        <p className="mt-2 text-sm text-muted">{t("topicsNote")}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          {copy.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-6">
          {copy.articles.map((a) => (
            <article key={a.id} className="border border-rule p-4">
              <p className="text-xs text-seal">{t("draftTag")} · {t("topicTag")} {a.topic} · {t("noFx")}</p>
              <h3 className="mt-2 font-serif text-2xl">{a.title}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed whitespace-pre-wrap">{a.body}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="paper" onClick={() => copyText(a.id, `${a.title}\n\n${a.body}`)}>
                  {copied === a.id ? t("copied") : t("copyAll")}
                </Btn>
                <Btn tone={checked[a.id] ? "seal" : "paper"} onClick={() => toggle(a.id)}>
                  {checked[a.id] ? t("reviewed") : t("markReview")}
                </Btn>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">{t("titlesTitle")}</h3>
        <Note>{t("titlesNote")}</Note>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {copy.seoDirections.map((d) => (
            <article key={d.direction} className="border-t border-rule pt-3">
              <p className="text-sm text-muted">{d.direction}</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {d.titles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </Frame>
  );
}
