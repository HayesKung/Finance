import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { SignPad } from "@/components/finpivot/sign-pad";
import { PRODUCTS } from "@/lib/finpivot/copy";
import { BILLINGS, nextStatuses, sopItems } from "@/lib/finpivot/flow";
import { useI18n } from "@/lib/finpivot/locale";
import { moveLabel, openOrdersLine } from "@/lib/finpivot/ui";
import { PAY_METHODS, agreementPhase, type PayMethod } from "@/lib/finpivot/agreement";
import { channelStatus, readStaffContract, saveChannel } from "@/lib/finpivot/contract-api";
import { whoami } from "@/lib/finpivot/staff-api";
import { pushSheet } from "@/lib/finpivot/publish-client";
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
  const setReview = useOs((s) => s.setReview);
  const setHandoff = useOs((s) => s.setHandoff);
  const reviseAmount = useOs((s) => s.reviseAmount);
  const setAdmission = useOs((s) => s.setAdmission);
  const toggleSop = useOs((s) => s.toggleSop);
  const reverseReceipt = useOs((s) => s.reverseReceipt);
  const toggleDeliverable = useOs((s) => s.toggleDeliverable);
  const agreements = useOs((s) => s.agreements ?? []);
  const firm = useOs((s) => s.firm);
  const setFirm = useOs((s) => s.setFirm);
  const countersign = useOs((s) => s.countersign);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [product, setProduct] = useState<Product>("出口财务包");
  const [billing, setBilling] = useState<Order["billing"]>("按单");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [draftPay, setDraftPay] = useState<Record<string, string>>({});
  const [draftMethod, setDraftMethod] = useState<Record<string, PayMethod>>({});
  const [ink, setInk] = useState<Record<string, string>>({});
  const [channels, setChannels] = useState({ wechat: false, alipay: false, esign: false });
  const [secret, setSecret] = useState<Record<string, string>>({});
  const [role, setRole] = useState<"owner" | "support" | null>(null);
  const [reviewName, setReviewName] = useState<Record<string, { preparer: string; reviewer: string }>>({});
  const [scopeDraft, setScopeDraft] = useState<Record<string, string>>({});
  const [reversal, setReversal] = useState<Record<string, { yuan: string; reason: string }>>({});
  const [voucher, setVoucher] = useState<Record<string, string>>({});
  const [closeout, setCloseout] = useState<Record<string, string>>({});
  const [nextFee, setNextFee] = useState<Record<string, string>>({});
  const [feeNote, setFeeNote] = useState<Record<string, string>>({});

  useEffect(() => {
    let stop = false;
    void channelStatus()
      .then((status) => {
        if (!stop) setChannels(status);
      })
      .catch(() => undefined);
    void whoami()
      .then((row) => {
        if (!stop) setRole(row.role);
      })
      .catch(() => undefined);
    void (async () => {
      for (const sheet of useOs.getState().agreements ?? []) {
        if (!sheet.staffToken) continue;
        const result = await readStaffContract({ data: { token: sheet.staffToken } }).catch(() => null);
        if (stop || !result?.payload) continue;
        useOs.getState().applyRemote(sheet.ref, result.payload);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

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
      <div className="mt-6">
        <Kicker n="11">{t("firmKicker")}</Kicker>
        <Note>{t("firmNote")}</Note>
        <p className="mt-3 text-sm text-muted">{t("payWays")}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label={t("firmLegal")}>
            <input className={inputCls} value={firm?.legalName ?? ""} onChange={(e) => setFirm({ legalName: e.target.value })} />
          </Field>
          <Field label={t("firmSigner")}>
            <input className={inputCls} value={firm?.signerName ?? ""} onChange={(e) => setFirm({ signerName: e.target.value })} />
          </Field>
          <Field label={t("payeeName")}>
            <input className={inputCls} value={firm?.payeeName ?? ""} onChange={(e) => setFirm({ payeeName: e.target.value })} />
          </Field>
          <Field label={t("payeeBank")}>
            <input className={inputCls} value={firm?.payeeBank ?? ""} onChange={(e) => setFirm({ payeeBank: e.target.value })} />
          </Field>
          <Field label={t("payeeAccount")}>
            <input className={inputCls} value={firm?.payeeAccount ?? ""} onChange={(e) => setFirm({ payeeAccount: e.target.value })} />
          </Field>
          <Field label={t("wechatId")}>
            <input className={inputCls} value={firm?.wechatId ?? ""} onChange={(e) => setFirm({ wechatId: e.target.value })} />
          </Field>
          <Field label={t("alipayAccount")}>
            <input className={inputCls} value={firm?.alipayAccount ?? ""} onChange={(e) => setFirm({ alipayAccount: e.target.value })} />
          </Field>
        </div>
        <div className="mt-8">
          <Kicker n="12">{t("channelKicker")}</Kicker>
          <Note>{t("channelNote")}</Note>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {(
              [
                ["wechat", t("channelWechat"), "https://pay.weixin.qq.com/"],
                ["alipay", t("channelAlipay"), "https://b.alipay.com/"],
                ["esign", t("channelEsign"), "https://open.esign.cn/"],
              ] as const
            ).map(([id, label, href]) => (
              <li key={id} className="border border-rule p-3">
                <p className="font-medium">{label}</p>
                <p className="mt-1 text-sm text-muted">{channels[id] ? t("channelArmed") : t("channelOff")}</p>
                <a className="mt-2 inline-flex h-11 items-center text-sm underline decoration-rule underline-offset-4" href={href} target="_blank" rel="noreferrer">
                  {t("channelOpen")}
                </a>
                {role === "owner" ? (
                  <>
                    <Field label={t("channelSecret")}>
                      <input className={inputCls} type="password" value={secret[id] ?? ""} autoComplete="off" onChange={(e) => setSecret({ ...secret, [id]: e.target.value })} />
                    </Field>
                    <div className="mt-2">
                      <Btn
                        tone="paper"
                        onClick={() => {
                          const value = secret[id]?.trim() ?? "";
                          if (!value) return;
                          void saveChannel({ data: { id, appId: "", merchantId: "", secret: value } }).then(() => {
                            setChannels({ ...channels, [id]: true });
                            setSecret({ ...secret, [id]: "" });
                          });
                        }}
                      >
                        {t("channelSave")}
                      </Btn>
                    </div>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
            const sheet = agreements.find((a) => a.orderId === o.id);
            const due = lines[0];
            const prepaid = !!due && due.expectedYuan > 0 && due.receivedYuan >= due.expectedYuan;
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
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                  <Field label={t("scopeLabel")}>
                    <input
                      className={inputCls}
                      value={scopeDraft[o.id] ?? o.admission?.scope ?? ""}
                      onChange={(e) => setScopeDraft({ ...scopeDraft, [o.id]: e.target.value })}
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2 md:items-end">
                    <Btn tone="paper" onClick={() => setAdmission(o.id, { scope: scopeDraft[o.id] ?? o.admission?.scope ?? "" })}>
                      {t("scopeLabel")}
                    </Btn>
                    <Btn tone={o.admission?.ndaAt ? "seal" : "paper"} onClick={() => setAdmission(o.id, { ndaAt: new Date().toISOString() })}>
                      {t("ndaMark")}
                    </Btn>
                    <Btn tone={o.admission?.conflictClear ? "seal" : "paper"} onClick={() => setAdmission(o.id, { conflictClear: true })}>
                      {t("conflictMark")}
                    </Btn>
                    <Btn tone={o.admission?.authorizedAt ? "seal" : "paper"} onClick={() => setAdmission(o.id, { authorizedAt: new Date().toISOString() })}>
                      {t("authorizeMark")}
                    </Btn>
                  </div>
                </div>
                <ul className="mt-3">
                  {(o.sop ?? sopItems(o.product).map((id) => ({ id, done: false }))).map((item) => (
                    <li key={item.id}>
                      <button type="button" className="flex items-center gap-3 py-1 text-left text-sm" onClick={() => toggleSop(o.id, item.id)}>
                        <span className={`inline-flex h-6 w-6 items-center justify-center border text-xs ${item.done ? "border-seal bg-seal text-seal-ink" : "border-rule"}`}>
                          {item.done ? "✓" : ""}
                        </span>
                        {item.id}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid gap-3 md:grid-cols-[8rem_1fr_auto] md:items-end">
                  <Field label={t("handoffVersion")}>
                    <input className={inputCls} value={o.handoff?.version ?? ""} onChange={(e) => setHandoff(o.id, { version: e.target.value.trim() })} />
                  </Field>
                  <Field label={t("closeoutNote")}>
                    <input
                      className={inputCls}
                      value={closeout[o.id] ?? o.handoff?.closeoutNote ?? ""}
                      onChange={(e) => setCloseout({ ...closeout, [o.id]: e.target.value })}
                      onBlur={() => setHandoff(o.id, { closeoutNote: closeout[o.id] ?? o.handoff?.closeoutNote ?? "" })}
                    />
                  </Field>
                  <Btn tone={o.handoff?.customerConfirmedAt ? "seal" : "paper"} onClick={() => role === "owner" && setHandoff(o.id, { customerConfirmedAt: new Date().toISOString() })}>
                    {t("handoffConfirm")}
                  </Btn>
                </div>
                {sheet ? (
                  <div className="mt-3 border border-rule p-3">
                    <p className="text-sm">{sheet.ref} · {show(agreementPhase(sheet, prepaid))}</p>
                    {sheet.signedName ? (
                      <p className="mt-1 text-sm text-muted">
                        {t("signPartyA")} · {sheet.signedName}
                        {sheet.signedImage ? " · " + t("signDraw") : ""}
                      </p>
                    ) : null}
                    {sheet.firmSignedAt ? <p className="mt-1 text-sm text-muted">{t("signPartyB")} · {sheet.firmSigner}</p> : null}
                    {sheet.claimedMethod ? <p className="mt-1 text-sm text-muted">{t("claimedVia")} · {show(sheet.claimedMethod)}</p> : null}
                    <a className="mt-2 inline-flex h-11 items-center text-sm underline decoration-rule underline-offset-4" href={sheet.customerToken ? `/sign?t=${encodeURIComponent(sheet.customerToken)}` : `/sign?ref=${encodeURIComponent(sheet.ref)}`}>
                      {t("openSign")}
                    </a>
                    {sheet.signedAt && !sheet.firmSignedAt ? (
                      <div className="mt-3 grid max-w-md gap-2">
                        <SignPad label={t("signDraw")} onChange={(dataUrl) => setInk({ ...ink, [sheet.ref]: dataUrl })} />
                        <Btn
                          onClick={() => {
                            const image = ink[sheet.ref] ?? "";
                            if (!countersign(sheet.ref, image)) return;
                            const snap = useOs.getState();
                            const next = snap.agreements.find((entry) => entry.ref === sheet.ref);
                            if (!next) return;
                            void pushSheet({
                              sheet: next,
                              firm: snap.firm,
                              company: client?.company ?? "",
                              product: o.product,
                              title: o.title,
                              billing: o.billing,
                              amountYuan: o.amountYuan,
                              dueLabel: due?.label ?? "",
                              dueYuan: due?.expectedYuan ?? 0,
                              deliverables: items.map((entry) => entry.name),
                              receivedYuan: due?.receivedYuan ?? 0,
                            });
                          }}
                        >
                          {t("countersign")}
                        </Btn>
                        {!firm?.signerName?.trim() || !ink[sheet.ref] ? <p className="text-sm text-seal">{t("countersignNeed")} {t("signDrawNeed")}</p> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {role === "owner" && (o.status === "草稿" || o.status === "待收款") ? (
                  <div className="mt-3 grid gap-2 md:grid-cols-[8rem_1fr_auto]">
                    <input className={inputCls} inputMode="numeric" value={nextFee[o.id] ?? ""} placeholder={t("reviseFee")} onChange={(e) => setNextFee({ ...nextFee, [o.id]: e.target.value.replace(/[^\d]/g, "") })} />
                    <input className={inputCls} value={feeNote[o.id] ?? ""} placeholder={t("reviseReason")} onChange={(e) => setFeeNote({ ...feeNote, [o.id]: e.target.value })} />
                    <Btn
                      tone="paper"
                      onClick={() => {
                        if (!nextFee[o.id] || !feeNote[o.id]) return;
                        reviseAmount(o.id, Number(nextFee[o.id]), feeNote[o.id]);
                      }}
                    >
                      {t("reviseFee")}
                    </Btn>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.status === "草稿" ? <Btn onClick={() => issuePlan(o.id)}>{t("issuePlan")}</Btn> : null}
                  {nextStatuses(o.status)
                    .filter((st) => st !== "已交付" || role === "owner")
                    .map((st) => (
                    <Btn key={st} tone={st === "已取消" ? "paper" : "ink"} onClick={() => moveOrder(o.id, st)}>
                      {moveLabel(locale, show(st))}
                    </Btn>
                  ))}
                </div>
                {lines.length > 0 ? (
                  <ul className="mt-4">
                    {lines.map((line) => (
                      <li key={line.id} className="grid gap-2 border-t border-rule py-3 md:grid-cols-5 md:items-end">
                        <p className="text-sm">
                          {show(line.label)}
                          <span className="mt-1 block text-muted">{t("expected")} {yuan(line.expectedYuan)}</span>
                        </p>
                        <p className="text-sm tabular-nums">
                          {t("received")} {yuan(line.receivedYuan)}
                          {line.method ? <span className="mt-1 block text-muted">{t("savedVia")} {show(line.method)}</span> : null}
                        </p>
                        {role === "owner" ? (
                          <>
                        <CanonSelect
                          value={draftMethod[line.id] ?? (sheet?.claimedMethod || "银行转账")}
                          options={PAY_METHODS}
                          onChange={(value) => setDraftMethod({ ...draftMethod, [line.id]: value as PayMethod })}
                        />
                        <input
                          className={inputCls}
                          inputMode="numeric"
                          value={draftPay[line.id] ?? ""}
                          placeholder={t("soFar")}
                          onChange={(e) => setDraftPay({ ...draftPay, [line.id]: e.target.value.replace(/[^\d]/g, "") })}
                        />
                        <input
                          className={inputCls}
                          value={voucher[line.id] ?? line.receiptRef ?? ""}
                          placeholder={t("receiptRef")}
                          onChange={(e) => setVoucher({ ...voucher, [line.id]: e.target.value })}
                        />
                        <Btn
                          tone="paper"
                          onClick={() => {
                            const raw = draftPay[line.id];
                            if (!raw) return;
                            recordReceipt(line.id, Number(raw), draftMethod[line.id] ?? (sheet?.claimedMethod || "银行转账"), voucher[line.id] ?? line.receiptRef ?? "");
                          }}
                        >
                          {t("register")}
                        </Btn>
                        <input
                          className={inputCls}
                          value={reversal[line.id]?.reason ?? ""}
                          placeholder={t("reversalReason")}
                          onChange={(e) => setReversal({ ...reversal, [line.id]: { yuan: reversal[line.id]?.yuan ?? draftPay[line.id] ?? "", reason: e.target.value } })}
                        />
                        <Btn
                          tone="paper"
                          onClick={() => {
                            const row = reversal[line.id];
                            const yuan = Number(row?.yuan || draftPay[line.id] || "");
                            if (!row?.reason || !yuan) return;
                            reverseReceipt(line.id, yuan, row.reason);
                          }}
                        >
                          {t("reversalSave")}
                        </Btn>
                          </>
                        ) : (
                          <p className="text-sm text-muted md:col-span-3">{t("ownerOnly")}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {items.length > 0 ? (
                  <>
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
                  <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <Field label={t("preparer")}>
                      <input
                        className={inputCls}
                        value={reviewName[o.id]?.preparer ?? items[0]?.preparer ?? ""}
                        onChange={(e) =>
                          setReviewName({
                            ...reviewName,
                            [o.id]: { preparer: e.target.value, reviewer: reviewName[o.id]?.reviewer ?? items[0]?.reviewer ?? "" },
                          })
                        }
                      />
                    </Field>
                    <Field label={t("reviewer")}>
                      <input
                        className={inputCls}
                        value={reviewName[o.id]?.reviewer ?? items[0]?.reviewer ?? ""}
                        onChange={(e) =>
                          setReviewName({
                            ...reviewName,
                            [o.id]: { reviewer: e.target.value, preparer: reviewName[o.id]?.preparer ?? items[0]?.preparer ?? "" },
                          })
                        }
                      />
                    </Field>
                    <Btn
                      tone="paper"
                      onClick={() => {
                        const row = reviewName[o.id] ?? { preparer: items[0]?.preparer ?? "", reviewer: items[0]?.reviewer ?? "" };
                        setReview(o.id, row.preparer, row.reviewer);
                      }}
                    >
                      {t("reviewSave")}
                    </Btn>
                  </div>
                  </>
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
