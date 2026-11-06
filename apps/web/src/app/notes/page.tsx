import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllNotes } from "@/actions/note-actions";
import { getTasks } from "@/actions/task-actions";
import { NotesClient } from "@/components/notes-client";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const sessionUser = await validateSession();
  if (!sessionUser) {
    redirect("/login");
  }

  const [allNotes, allTasks] = await Promise.all([getAllNotes(), getTasks()]);

  return (
    <NotesClient
      user={{ username: sessionUser.username }}
      allNotes={allNotes}
      allTasks={allTasks}
    />
  );
}
