import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { PRODUCTS } from "@/lib/finpivot/copy";
import { BILLINGS, nextStatuses } from "@/lib/finpivot/flow";
import { useI18n } from "@/lib/finpivot/locale";
import { moveLabel, openOrdersLine } from "@/lib/finpivot/ui";
import { useOs, type Order, type Product } from "@/lib/finpivot/store";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const { locale, t, show, yuan, copy } = useI18n();
  const clients = useOs((s) => s.clients);
  const projects = useOs((s) => s.projects);
  const orders = useOs((s) => s.orders);
  const payments = useOs((s) => s.payments);
  const deliverables = useOs((s) => s.deliverables);
  const addOrder = useOs((s) => s.addOrder);
  const issuePlan = useOs((s) => s.issuePlan);
  const moveOrder = useOs((s) => s.moveOrder);
  const recordReceipt = useOs((s) => s.recordReceipt);
  const toggleDeliverable = useOs((s) => s.toggleDeliverable);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [product, setProduct] = useState<Product>("出口财务包");
  const [billing, setBilling] = useState<Order["billing"]>("按单");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [draftPay, setDraftPay] = useState<Record<string, string>>({});

  const clientProjects = projects.filter((p) => p.clientId === clientId);
  const open = orders.filter((o) => o.status !== "已取消" && o.status !== "已交付");
  const outstanding = payments.reduce((sum, p) => sum + Math.max(0, p.expectedYuan - p.receivedYuan), 0);
  const priced = PRODUCTS.filter((p) => p !== "未定");

  return (
    <Frame>
      <Kicker n="10">{t("orderKicker")}</Kicker>
      <Note>{t("orderNote")}</Note>
      <ol className="mt-4 grid gap-2 md:grid-cols-4">
        {copy.e2eSteps.map((step, i) => (
          <li key={step} className="border border-rule px-3 py-2 text-sm leading-relaxed">
            <span className="font-serif text-seal">{i + 1}</span> {step}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">{openOrdersLine(locale, open.length, yuan(outstanding))}</p>
      <p className="mt-2 text-sm text-muted">{t("fxRule")}</p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Field label={t("client")}>
          <select
            className={inputCls}
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setProjectId("");
            }}
          >
            <option value="">{t("pickClient")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.alias}</option>
            ))}
          </select>
        </Field>
        <Field label={t("projectOptional")}>
          <select className={inputCls} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">{t("noProject")}</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label={t("product")}>
          <CanonSelect value={product} options={priced} onChange={(value) => setProduct(value as Product)} />
        </Field>
        <Field label={t("billing")}>
          <CanonSelect value={billing} options={BILLINGS} onChange={(value) => setBilling(value as Order["billing"])} />
        </Field>
        <Field label={t("orderTitle")}>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("orderPh")} />
        </Field>
        <Field label={t("fee")}>
          <input className={inputCls} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} />
        </Field>
      </div>
      <p className="mt-3 text-sm text-muted">{t("feeRule")}</p>
      <div className="mt-3">
        <Btn
          onClick={() => {
            const amountYuan = Number(amount);
            if (!clientId || !title.trim() || !amountYuan) return;
            addOrder({ clientId, projectId, product, billing, title: title.trim(), amountYuan });
            setTitle("");
            setAmount("");
          }}
        >
          {t("createDraft")}
        </Btn>
      </div>

      <ul className="mt-8 border-t border-ink">
        {orders.length === 0 ? (
          <li className="py-6 text-sm text-muted">{t("emptyOrders")}</li>
        ) : (
          orders.map((o) => {
            const client = clients.find((c) => c.id === o.clientId);
            const project = projects.find((p) => p.id === o.projectId);
            const lines = payments.filter((p) => p.orderId === o.id);
            const items = deliverables.filter((d) => d.orderId === o.id);
            return (
              <li key={o.id} className="border-b border-rule py-5">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <p className="font-medium">{client?.alias ?? t("clientGone")} · {o.title}</p>
                  <p className="font-serif text-xl tabular-nums">{yuan(o.amountYuan)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {show(o.product)} · {show(o.billing)}
                  {project ? ` · ${project.name}` : ""} · {show(o.status)}
                </p>
                {o.blockReason ? <p className="mt-2 text-sm text-seal">{show(o.blockReason)}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.status === "草稿" ? <Btn onClick={() => issuePlan(o.id)}>{t("issuePlan")}</Btn> : null}
                  {nextStatuses(o.status).map((st) => (
                    <Btn key={st} tone={st === "已取消" ? "paper" : "ink"} onClick={() => moveOrder(o.id, st)}>
                      {moveLabel(locale, show(st))}
                    </Btn>
                  ))}
                </div>
                {lines.length > 0 ? (
                  <ul className="mt-4">
                    {lines.map((line) => (
                      <li key={line.id} className="grid gap-2 border-t border-rule py-3 md:grid-cols-4 md:items-end">
                        <p className="text-sm">
                          {show(line.label)}
                          <span className="mt-1 block text-muted">{t("expected")} {yuan(line.expectedYuan)}</span>
                        </p>
                        <p className="text-sm tabular-nums">{t("received")} {yuan(line.receivedYuan)}</p>
                        <input
                          className={inputCls}
                          inputMode="numeric"
                          value={draftPay[line.id] ?? ""}
                          placeholder={t("soFar")}
                          onChange={(e) => setDraftPay({ ...draftPay, [line.id]: e.target.value.replace(/[^\d]/g, "") })}
                        />
                        <Btn
                          tone="paper"
                          onClick={() => {
                            const raw = draftPay[line.id];
                            if (!raw) return;
                            recordReceipt(line.id, Number(raw));
                          }}
                        >
                          {t("register")}
                        </Btn>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {items.length > 0 ? (
                  <ul className="mt-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button type="button" className="flex items-center gap-3 py-2 text-left text-sm" onClick={() => toggleDeliverable(item.id)}>
                          <span className={`inline-flex h-6 w-6 items-center justify-center border text-xs ${item.done ? "border-seal bg-seal text-seal-ink" : "border-rule"}`}>
                            {item.done ? "✓" : ""}
                          </span>
                          {show(item.name)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
      <p className="mt-4 text-xs text-muted">{t("statusHint")}</p>
    </Frame>
  );
}
