import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { SignPad } from "@/components/finpivot/sign-pad";
import { PAY_METHODS, agreementPhase, bothSigned, contractBody, methodDetail, methodReady, type PayMethod } from "@/lib/finpivot/agreement";
import { customerClaim, customerSign, readContract } from "@/lib/finpivot/contract-api";
import type { ContractPayload } from "@/lib/finpivot/contract-share";
import { signAccess } from "@/lib/finpivot/gate";
import { useI18n } from "@/lib/finpivot/locale";

export const Route = createFileRoute("/sign")({ component: SignPage });

function SignPage() {
  const { t } = useI18n();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("t") ?? "");
  }, []);
  if (token === null) {
    return (
      <Frame>
        <p className="text-sm text-muted">{t("signLoading")}</p>
      </Frame>
    );
  }
  if (signAccess(token) === "remote") return <RemoteSign token={token.trim()} />;
  return <ClosedSign />;
}

function ClosedSign() {
  const { t } = useI18n();
  return (
    <Frame>
      <Kicker n="01">{t("signKicker")}</Kicker>
      <Note>{t("signClosed")}</Note>
    </Frame>
  );
}

function RemoteSign({ token }: { token: string }) {
  const { t, show, yuan } = useI18n();
  const [payload, setPayload] = useState<ContractPayload | null>(null);
  const [missing, setMissing] = useState(false);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [ink, setInk] = useState("");
  const [inkMiss, setInkMiss] = useState(false);
  const [method, setMethod] = useState<PayMethod | "">("");
  const [copied, setCopied] = useState(false);

  const load = () => {
    void readContract({ data: { token } }).then((result) => {
      setPayload(result.payload);
      setMissing(!result.payload);
    });
  };

  useEffect(() => {
    load();
  }, [token]);

  if (!payload) {
    return (
      <Frame>
        <Kicker n="01">{t("signKicker")}</Kicker>
        <p className="text-sm text-muted">{missing ? t("signMissing") : t("signLoading")}</p>
      </Frame>
    );
  }

  const ready = bothSigned(payload);
  const settled = payload.dueYuan > 0 && payload.receivedYuan >= payload.dueYuan;
  const channels = payload;
  const anyReady = PAY_METHODS.some((item) => methodReady(channels, item));
  const text = contractBody({
    ref: payload.ref,
    company: payload.company,
    firmName: payload.firmName,
    product: show(payload.product),
    title: payload.title,
    billing: show(payload.billing),
    amountYuan: payload.amountYuan,
    dueLabel: show(payload.dueLabel),
    dueYuan: payload.dueYuan,
    deliverables: payload.deliverables.map((item) => show(item)),
    payeeName: payload.payeeName,
    payeeBank: payload.payeeBank,
    payeeAccount: payload.payeeAccount,
    wechatId: payload.wechatId,
    alipayAccount: payload.alipayAccount,
  });

  return (
    <Frame>
      <Kicker n="01">{t("signKicker")}</Kicker>
      <p className="max-w-xl text-lg leading-relaxed">{t("signLede")}</p>
      <div className="mt-4 max-w-xl">
        <Note>{t("signSameBrowser")}</Note>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("signOnline")}</p>
      </div>
      <section className="mt-8 max-w-xl border border-ink p-6">
        <p className="font-serif text-3xl tracking-wide">{payload.ref}</p>
        <p className="mt-3 text-sm text-muted">{show(agreementPhase(payload, settled))}</p>
        <p className="mt-4 font-medium">{payload.company}</p>
        <p className="mt-1 text-sm">{show(payload.product)} · {payload.title}</p>
        <p className="mt-4 text-sm text-muted">{t("signDue")}</p>
        <p className="font-serif text-3xl tabular-nums">{yuan(payload.dueYuan)}</p>
        <pre className="mt-4 whitespace-pre-wrap border border-rule bg-paper-2 p-4 text-sm leading-relaxed">{text}</pre>
        <div className="mt-3">
          <Btn tone="paper" onClick={() => { void navigator.clipboard?.writeText(text).then(() => setCopied(true)); }}>
            {copied ? t("signCopied") : t("signCopy")}
          </Btn>
        </div>
        {payload.signedAt ? (
          <div className="mt-4 border-t border-rule pt-4">
            <p className="text-sm">{t("signPartyA")} · {payload.signedName}</p>
            {payload.signedImage ? <img src={payload.signedImage} alt={payload.signedName} className="mt-2 h-24 border border-rule bg-paper" /> : null}
            {payload.firmSignedAt ? (
              <div className="mt-3">
                <p className="text-sm">{t("signPartyB")} · {payload.firmSigner}</p>
                {payload.firmSignImage ? <img src={payload.firmSignImage} alt={payload.firmSigner} className="mt-2 h-24 border border-rule bg-paper" /> : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-seal">{t("signWaitFirm")}</p>
            )}
            {ready && anyReady && !payload.claimedAt ? (
              <div className="mt-3">
                <p className="text-sm text-muted">{t("payWays")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PAY_METHODS.map((item) => (
                    <button key={item} type="button" className={`inline-flex h-11 items-center border px-3 text-sm ${method === item ? "border-ink bg-ink text-paper" : "border-rule text-ink"}`} onClick={() => setMethod(item)}>
                      {show(item)}
                    </button>
                  ))}
                </div>
                {method && methodReady(channels, method) ? <p className="mt-3 text-sm">{methodDetail(channels, method)}</p> : null}
                {method && !methodReady(channels, method) ? <p className="mt-3 text-sm text-seal">{t("methodEmpty")}</p> : null}
                {method && methodReady(channels, method) ? (
                  <div className="mt-3">
                    <Btn onClick={() => { void customerClaim({ data: { token, method } }).then(load); }}>{t("signClaim")}</Btn>
                  </div>
                ) : null}
              </div>
            ) : null}
            {payload.claimedAt ? <p className="mt-2 text-sm text-muted">{t("signClaimed")} {payload.claimedMethod ? show(payload.claimedMethod) : ""}</p> : null}
          </div>
        ) : (
          <form className="mt-4 grid gap-3" onSubmit={(e) => {
            e.preventDefault();
            if (!ink) { setInkMiss(true); return; }
            if (!consent) return;
            void customerSign({ data: { token, name, image: ink } }).then(load);
          }}>
            <Field label={t("signName")}>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <SignPad label={t("signDraw")} onChange={setInk} />
            {inkMiss && !ink ? <p className="text-sm text-seal">{t("signDrawNeed")}</p> : null}
            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input className="mt-1 size-4 shrink-0" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{t("signConsent")}</span>
            </label>
            <div><Btn type="submit">{t("signConfirm")}</Btn></div>
          </form>
        )}
      </section>
    </Frame>
  );
}

