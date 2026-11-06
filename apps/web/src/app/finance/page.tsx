import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFinanceOverview } from "@/actions/finance-actions";
import { FinanceClient } from "@/components/finance-client";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const sessionUser = await validateSession();
  if (!sessionUser) {
    redirect("/login");
  }

  const finance = await getFinanceOverview();

  return <FinanceClient user={{ username: sessionUser.username }} finance={finance} />;
}
