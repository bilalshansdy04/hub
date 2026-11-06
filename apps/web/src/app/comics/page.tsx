import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getComics } from "@/actions/comic-actions";
import { ComicsClient } from "@/components/comics-client";

export const dynamic = "force-dynamic";

export default async function ComicsPage() {
  const sessionUser = await validateSession();
  if (!sessionUser) {
    redirect("/login");
  }

  const comicsList = await getComics();

  return <ComicsClient user={{ username: sessionUser.username }} comicsList={comicsList} />;
}
