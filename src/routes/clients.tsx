import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { SOURCES } from "@/lib/finpivot/copy";
import { CLIENT_STATUSES, PROJECT_STATUSES } from "@/lib/finpivot/flow";
import { useI18n } from "@/lib/finpivot/locale";
import { CURRENCIES, convertAtRate, currencyLine, formatMoney } from "@/lib/finpivot/glossary";
import { cannotDelete } from "@/lib/finpivot/ui";
import { useOs, type Client, type Project, type Source } from "@/lib/finpivot/store";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

const blank = {
  alias: "",
  company: "",
  industry: "",
  direction: "",
  market: "",
  source: "老关系" as Source,
  publicChannel: "",
  consentPrivate: false,
  privateContact: "",
  status: "潜在" as Client["status"],
  note: "",
};

function ClientsPage() {
  const { locale, t, show } = useI18n();
  const clients = useOs((s) => s.clients);
  const projects = useOs((s) => s.projects);
  const orders = useOs((s) => s.orders);
  const addClient = useOs((s) => s.addClient);
  const updateClient = useOs((s) => s.updateClient);
  const removeClient = useOs((s) => s.removeClient);
  const forgetPrivate = useOs((s) => s.forgetPrivate);
  const addProject = useOs((s) => s.addProject);
  const updateProject = useOs((s) => s.updateProject);
  const removeProject = useOs((s) => s.removeProject);
  const [form, setForm] = useState(blank);
  const [projectName, setProjectName] = useState<Record<string, string>>({});
  const [quotePick, setQuotePick] = useState<Record<string, string>>({});
  const [settlePick, setSettlePick] = useState<Record<string, string>>({});
  const [amountDraft, setAmountDraft] = useState<Record<string, string>>({});
  const [rateDraft, setRateDraft] = useState<Record<string, string>>({});
  const [warn, setWarn] = useState("");

  return (
    <Frame>
      <Kicker n="09">{t("clientKicker")}</Kicker>
      <Note>{t("clientNote")}</Note>
      <p className="mt-3 text-sm text-muted">{t("fxRule")}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Field label={t("aliasLabel")}>
          <input className={inputCls} value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
        </Field>
        <Field label={t("company")}>
          <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
        <Field label={t("industry")}>
          <input className={inputCls} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </Field>
        <Field label={t("direction")}>
          <input className={inputCls} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} />
        </Field>
        <Field label={t("market")}>
          <input className={inputCls} value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} />
        </Field>
        <Field label={t("source")}>
          <CanonSelect value={form.source} options={SOURCES} onChange={(value) => setForm({ ...form, source: value as Source })} />
        </Field>
        <Field label={t("publicChannel")}>
          <input
            className={inputCls}
            value={form.publicChannel}
            onChange={(e) => {
              const v = e.target.value;
              setForm({ ...form, publicChannel: v });
              setWarn(/1[3-9]\d{9}/.test(v) ? t("phoneWarnShort") : "");
            }}
          />
        </Field>
        <Field label={t("status")}>
          <CanonSelect value={form.status} options={CLIENT_STATUSES} onChange={(value) => setForm({ ...form, status: value as Client["status"] })} />
        </Field>
        <Field label={t("note")}>
          <input className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </Field>
      </div>
      {warn ? <p className="mt-3 text-sm text-seal">{warn}</p> : null}
      <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5"
          checked={form.consentPrivate}
          onChange={(e) =>
            setForm({
              ...form,
              consentPrivate: e.target.checked,
              privateContact: e.target.checked ? form.privateContact : "",
            })
          }
        />
        {t("consentShort")}
      </label>
      {form.consentPrivate ? (
        <div className="mt-3 max-w-md">
          <Field label={t("privateLabel")}>
            <input className={inputCls} value={form.privateContact} onChange={(e) => setForm({ ...form, privateContact: e.target.value })} />
          </Field>
        </div>
      ) : null}
      <div className="mt-4">
        <Btn
          onClick={() => {
            if (!form.alias.trim() || !form.company.trim()) return;
            addClient(form);
            setForm(blank);
            setWarn("");
          }}
        >
          {t("createClient")}
        </Btn>
      </div>

      <ul className="mt-8 border-t border-ink">
        {clients.length === 0 ? (
          <li className="py-6 text-sm text-muted">{t("emptyClients")}</li>
        ) : (
          clients.map((c) => {
            const own = projects.filter((p) => p.clientId === c.id);
            const openOrders = orders.filter((o) => o.clientId === c.id && o.status !== "已取消").length;
            return (
              <li key={c.id} className="border-b border-rule py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium">{c.alias}</p>
                    <p className="text-sm text-muted">{c.company} · {c.industry} · {c.market}</p>
                    <p className="mt-1 text-sm">{c.direction || t("directionMissing")} · {show(c.source)}</p>
                    {c.consentPrivate ? <p className="text-sm text-seal">{t("privateOnDevice")}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CanonSelect
                      className="h-11 border border-rule bg-paper px-2 text-sm"
                      value={c.status}
                      options={CLIENT_STATUSES}
                      onChange={(value) => updateClient(c.id, { status: value as Client["status"] })}
                    />
                    <Btn tone="paper" onClick={() => removeClient(c.id)}>{t("remove")}</Btn>
                    <Btn tone={c.forgottenAt ? "seal" : "paper"} onClick={() => forgetPrivate(c.id)}>{t("forgetContact")}</Btn>
                  </div>
                </div>
                {openOrders > 0 ? <p className="mt-2 text-sm text-muted">{cannotDelete(locale, openOrders)}</p> : null}
                {c.block ? <p className="mt-2 text-sm text-seal">{show(c.block)}</p> : null}
                <div className="mt-4 border-t border-rule pt-3">
                  <p className="text-sm text-muted">{t("projects")}</p>
                  <ul className="mt-2">
                    {own.map((p) => {
                      const pair = currencyLine(p.quoteCurrency, p.settleCurrency);
                      const amount = p.quoteAmount ?? 0;
                      const rate = p.fxRate ?? 0;
                      const converted = pair.differs ? convertAtRate(amount, rate) : amount > 0 ? amount : null;
                      const showResult = converted != null && amount > 0 && (!pair.differs || rate > 0);
                      const money = (raw: string) => raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
                      return (
                      <li key={p.id} className="flex flex-col gap-2 border-b border-rule py-3">
                        <p className="text-sm">{p.name} · {p.market || t("marketMissing")}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <label className="flex items-center gap-2 text-xs text-muted">
                            {t("quoteCurrency")}
                            <CanonSelect
                              className="h-11 border border-rule bg-paper px-2 text-sm text-ink"
                              value={pair.quote}
                              options={CURRENCIES}
                              blank={{ value: "", label: t("currencyUnset") }}
                              onChange={(value) => updateProject(p.id, { quoteCurrency: value })}
                            />
                          </label>
                          <label className="flex items-center gap-2 text-xs text-muted">
                            {t("settleCurrency")}
                            <CanonSelect
                              className="h-11 border border-rule bg-paper px-2 text-sm text-ink"
                              value={pair.settle}
                              options={CURRENCIES}
                              blank={{ value: "", label: t("currencyUnset") }}
                              onChange={(value) => updateProject(p.id, { settleCurrency: value })}
                            />
                          </label>
                          <CanonSelect
                            className="h-11 border border-rule bg-paper px-2 text-sm"
                            value={p.status}
                            options={PROJECT_STATUSES}
                            onChange={(value) => updateProject(p.id, { status: value as Project["status"] })}
                          />
                          <Btn tone="paper" onClick={() => removeProject(p.id)}>{t("removeProject")}</Btn>
                        </div>
                        {pair.quote && pair.settle ? (
                          <div className="flex flex-col gap-2">
                            <label className="flex flex-col gap-1 text-xs text-muted sm:max-w-xs">
                              {t("quoteAmount")}
                              <input
                                className={inputCls}
                                inputMode="decimal"
                                value={amountDraft[p.id] ?? (amount > 0 ? String(amount) : "")}
                                onChange={(e) => {
                                  const raw = money(e.target.value);
                                  setAmountDraft({ ...amountDraft, [p.id]: raw });
                                  const n = raw === "" || raw === "." ? 0 : Number(raw);
                                  if (Number.isFinite(n)) updateProject(p.id, { quoteAmount: n });
                                }}
                              />
                            </label>
                            {pair.differs ? (
                              <label className="flex flex-col gap-1 text-xs text-muted sm:max-w-md">
                                <span>{t("fxRate")}</span>
                                <span className="flex items-center gap-2 text-sm text-ink">
                                  1 {pair.quote} =
                                  <input
                                    className={inputCls}
                                    inputMode="decimal"
                                    value={rateDraft[p.id] ?? (rate > 0 ? String(rate) : "")}
                                    onChange={(e) => {
                                      const raw = money(e.target.value);
                                      setRateDraft({ ...rateDraft, [p.id]: raw });
                                      const n = raw === "" || raw === "." ? 0 : Number(raw);
                                      if (Number.isFinite(n)) updateProject(p.id, { fxRate: n });
                                    }}
                                  />
                                  {pair.settle}
                                </span>
                              </label>
                            ) : (
                              <p className="text-xs text-muted">{t("sameCurrency")}</p>
                            )}
                            {pair.differs && !(rate > 0) ? <p className="text-xs leading-relaxed text-seal">{t("needRate")}</p> : null}
                            {showResult ? (
                              <p className="text-sm">
                                {t("converted")} {formatMoney(locale, pair.differs ? pair.settle : pair.quote, converted)}
                              </p>
                            ) : null}
                            {pair.differs && rate > 0 ? <p className="text-xs leading-relaxed text-muted">{t("noConvert")}</p> : null}
                          </div>
                        ) : null}
                      </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 flex flex-col gap-2">
                    <input
                      className={inputCls}
                      placeholder={t("projectPh")}
                      value={projectName[c.id] ?? ""}
                      onChange={(e) => setProjectName({ ...projectName, [c.id]: e.target.value })}
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <label className="flex items-center gap-2 text-xs text-muted">
                        {t("quoteCurrency")}
                        <CanonSelect
                          className="h-11 border border-rule bg-paper px-2 text-sm text-ink"
                          value={quotePick[c.id] ?? ""}
                          options={CURRENCIES}
                          blank={{ value: "", label: t("currencyUnset") }}
                          onChange={(value) => setQuotePick({ ...quotePick, [c.id]: value })}
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted">
                        {t("settleCurrency")}
                        <CanonSelect
                          className="h-11 border border-rule bg-paper px-2 text-sm text-ink"
                          value={settlePick[c.id] ?? ""}
                          options={CURRENCIES}
                          blank={{ value: "", label: t("currencyUnset") }}
                          onChange={(value) => setSettlePick({ ...settlePick, [c.id]: value })}
                        />
                      </label>
                      <Btn
                        tone="paper"
                        onClick={() => {
                          const name = (projectName[c.id] ?? "").trim();
                          if (!name) return;
                          addProject({
                            clientId: c.id,
                            name,
                            market: c.market,
                            quoteCurrency: quotePick[c.id] ?? "",
                            settleCurrency: settlePick[c.id] ?? "",
                            quoteAmount: 0,
                            fxRate: 0,
                            status: "立项",
                            note: "",
                          });
                          setProjectName({ ...projectName, [c.id]: "" });
                        }}
                      >
                        {t("addProject")}
                      </Btn>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Frame>
  );
}
