import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getScheduleBlocks } from "@/actions/calendar-actions";
import { CalendarClient } from "@/components/calendar-client";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const sessionUser = await validateSession();
  if (!sessionUser) {
    redirect("/login");
  }

  const blocks = await getScheduleBlocks();

  return <CalendarClient user={{ username: sessionUser.username }} blocks={blocks} />;
}
