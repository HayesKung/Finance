import { redirect } from "@tanstack/react-router";
import { whoami } from "@/lib/finpivot/staff-api";

export async function requireStaffPage() {
  const row = await whoami();
  if (!row.role) throw redirect({ to: "/staff/login" });
}
