import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, inputCls } from "@/components/finpivot/frame";
import { useI18n } from "@/lib/finpivot/locale";
import { loginStaff, whoami } from "@/lib/finpivot/staff-api";

export const Route = createFileRoute("/staff/login")({ component: StaffLoginPage });

function StaffLoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let stop = false;
    void whoami()
      .then((row) => {
        if (stop) return;
        setConfigured(row.configured);
        if (row.role) void navigate({ to: "/os" });
      })
      .catch(() => {
        if (!stop) setConfigured(false);
      });
    return () => {
      stop = true;
    };
  }, [navigate]);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-paper px-4 py-16 text-ink">
      <h1 className="font-serif text-2xl">{t("staffEntry")}</h1>
      {configured === false ? <p className="mt-4 text-sm leading-relaxed">{t("staffUnconfigured")}</p> : null}
      {configured ? (
        <form
          className="mt-6 border border-rule p-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            void loginStaff({ data: { password } })
              .then(() => {
                setPassword("");
                void navigate({ to: "/os" });
              })
              .catch(() => setError(t("staffBad")));
          }}
        >
          <p className="text-sm leading-relaxed">{t("staffLocked")}</p>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span className="text-muted">{t("staffPassword")}</span>
            <input
              className={inputCls}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <div className="mt-4">
            <Btn type="submit">{t("staffEnter")}</Btn>
          </div>
          {error ? <p className="mt-3 text-sm text-seal">{error}</p> : null}
        </form>
      ) : null}
      <Link to="/" className="mt-6 inline-flex h-11 items-center text-sm text-muted underline decoration-rule underline-offset-4">
        {t("seePublic")}
      </Link>
    </main>
  );
}
