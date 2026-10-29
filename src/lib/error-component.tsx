import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useI18n } from "@/lib/finpivot/locale";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const { t } = useI18n();
  const message = error instanceof Error && error.message
    ? error.message
    : typeof error === "string" && error
      ? error
      : t("errFallback");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <TriangleAlert className="size-10 text-seal" aria-hidden />
      <h1 className="font-serif text-xl">{t("errTitle")}</h1>
      <p className="max-w-md text-sm break-words text-muted">{message}</p>
    </main>
  );
}
