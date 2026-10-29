import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { agreementPhase } from "@/lib/finpivot/agreement";
import { useI18n } from "@/lib/finpivot/locale";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/sign")({ component: SignPage });

function SignPage() {
  const { t, show, yuan } = useI18n();
  const agreements = useOs((s) => s.agreements ?? []);
  const orders = useOs((s) => s.orders);
  const clients = useOs((s) => s.clients);
  const payments = useOs((s) => s.payments);
  const deliverables = useOs((s) => s.deliverables);
  const signAgreement = useOs((s) => s.signAgreement);
  const claimPrepaid = useOs((s) => s.claimPrepaid);
  const [ref, setRef] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("ref");
    if (fromUrl) setRef(fromUrl);
  }, []);

  const sheet = agreements.find((item) => item.ref === ref.trim());
  const order = sheet ? orders.find((item) => item.id === sheet.orderId) : undefined;
  const client = sheet ? clients.find((item) => item.id === sheet.clientId) : undefined;
  const lines = sheet ? payments.filter((item) => item.orderId === sheet.orderId) : [];
  const due = lines[0];
  const settled = !!due && due.expectedYuan > 0 && due.receivedYuan >= due.expectedYuan;
  const items = sheet ? deliverables.filter((item) => item.orderId === sheet.orderId) : [];

  return (
    <Frame>
      <Kicker n="01">{t("signKicker")}</Kicker>
      <p className="max-w-xl text-lg leading-relaxed">{t("signLede")}</p>
      <div className="mt-4 max-w-xl">
        <Note>{t("signSameBrowser")}</Note>
      </div>
      <form
        className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setMiss(!agreements.some((item) => item.ref === ref.trim()));
        }}
      >
        <Field label={t("signRef")}>
          <input className={inputCls} value={ref} onChange={(e) => setRef(e.target.value)} />
        </Field>
        <Btn type="submit">{t("signLookup")}</Btn>
      </form>
      {miss && !sheet ? <p className="mt-4 text-sm text-seal">{t("signMissing")}</p> : null}
      {sheet && order && due ? (
        <section className="mt-8 max-w-xl border border-ink p-6">
          <p className="font-serif text-3xl tracking-wide">{sheet.ref}</p>
          <p className="mt-3 text-sm text-muted">{show(agreementPhase(sheet, settled))}</p>
          <p className="mt-4 font-medium">{client?.company}</p>
          <p className="mt-1 text-sm">{show(order.product)} · {order.title}</p>
          <p className="mt-4 text-sm text-muted">{t("signDue")}</p>
          <p className="font-serif text-3xl tabular-nums">{yuan(due.expectedYuan)}</p>
          <p className="mt-1 text-sm text-muted">{show(due.label)} · {t("fee")} {yuan(order.amountYuan)}</p>
          <p className="mt-4 text-sm text-muted">{t("signScope")}</p>
          <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed">
            {items.map((item) => (
              <li key={item.id}>{show(item.name)}</li>
            ))}
          </ul>
          <div className="mt-4 border-t border-rule pt-4">
            {sheet.payeeAccount.trim() ? (
              <>
                <p className="text-sm text-muted">{t("signPayee")}</p>
                <p className="mt-1 text-sm">{sheet.payeeName}</p>
                <p className="text-sm">{sheet.payeeBank}</p>
                <p className="text-sm">{sheet.payeeAccount}</p>
              </>
            ) : (
              <p className="text-sm text-seal">{t("signPayeeMissing")}</p>
            )}
          </div>
          {sheet.signedAt ? (
            <div className="mt-4">
              <p className="text-sm">{t("signSigned")} · {sheet.signedName}</p>
              {sheet.claimedAt ? (
                <p className="mt-2 text-sm text-muted">{t("signClaimed")}</p>
              ) : sheet.payeeAccount.trim() ? (
                <div className="mt-3">
                  <Btn onClick={() => claimPrepaid(sheet.ref)}>{t("signClaim")}</Btn>
                </div>
              ) : null}
            </div>
          ) : (
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!consent) return;
                signAgreement(sheet.ref, name);
              }}
            >
              <Field label={t("signName")}>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input className="mt-1 size-4 shrink-0" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{t("signConsent")}</span>
              </label>
              <div>
                <Btn type="submit">{t("signConfirm")}</Btn>
              </div>
            </form>
          )}
        </section>
      ) : null}
    </Frame>
  );
}
