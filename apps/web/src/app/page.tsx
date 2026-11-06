import { validateAndRefreshSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFinanceOverview } from "@/actions/finance-actions";
import { getComics } from "@/actions/comic-actions";
import { getTasks } from "@/actions/task-actions";
import { getPinnedNote } from "@/actions/note-actions";
import { DashboardClient } from "@/components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Sliding Session: Validates token & automatically extends expiration +7 days
  const sessionUser = await validateAndRefreshSession();
  if (!sessionUser) {
    redirect("/login");
  }

  // 2. Fetch all module data in parallel
  const [finance, comicsList, tasksList, pinnedNote] = await Promise.all([
    getFinanceOverview(),
    getComics(),
    getTasks(),
    getPinnedNote(),
  ]);

  return (
    <DashboardClient
      user={{ username: sessionUser.username }}
      finance={finance}
      comicsList={comicsList}
      tasksList={tasksList}
      pinnedNote={pinnedNote}
    />
  );
}
