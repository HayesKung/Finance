import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Frame, Kicker, Note, areaCls } from "@/components/finpivot/frame";
import { templateSeeds } from "@/lib/finpivot/copy";
import { templateSeeds as enSeeds } from "@/lib/finpivot/en-content";
import { activeBody } from "@/lib/finpivot/glossary";
import { useI18n } from "@/lib/finpivot/locale";
import { requireStaffPage } from "@/lib/finpivot/staff-gate";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/templates")({ beforeLoad: () => requireStaffPage(), component: TemplatesPage });

function TemplatesPage() {
  const { locale, t, copy } = useI18n();
  const templates = useOs((s) => s.templates);
  const setTemplate = useOs((s) => s.setTemplate);
  const [id, setId] = useState(templateSeeds[0].id);
  const [copied, setCopied] = useState(false);
  const meta = copy.templateSeeds.find((item) => item.id === id) ?? copy.templateSeeds[0];
  const zhBody = templateSeeds.find((item) => item.id === meta.id)?.body ?? "";
  const enBody = enSeeds.find((item) => item.id === meta.id)?.body ?? zhBody;
  const body = activeBody(locale, templates[meta.id], zhBody, enBody);

  return (
    <Frame>
      <Kicker n="08">{t("tplKicker")}</Kicker>
      <Note>{t("tplNote")}</Note>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {copy.templateSeeds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setId(item.id)}
            className={`inline-flex h-11 shrink-0 items-center border px-3 text-sm ${
              item.id === meta.id ? "border-ink bg-ink text-paper" : "border-rule"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{meta.from}</p>
      <textarea className={`${areaCls} mt-3 min-h-96 font-mono`} value={body} onChange={(e) => setTemplate(meta.id, e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            void navigator.clipboard.writeText(body).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            });
          }}
        >
          {copied ? t("copied") : t("copy")}
        </Btn>
        <Btn
          tone="paper"
          onClick={() => {
            const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${meta.name}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          {t("download")}
        </Btn>
        <Btn tone="paper" onClick={() => setTemplate(meta.id, locale === "en" ? enBody : zhBody)}>
          {t("resetSeed")}
        </Btn>
      </div>
    </Frame>
  );
}
