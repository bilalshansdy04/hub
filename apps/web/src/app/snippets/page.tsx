import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSnippets } from "@/actions/snippet-actions";
import { SnippetsClient } from "@/components/snippets-client";

export const dynamic = "force-dynamic";

export default async function SnippetsPage() {
  const sessionUser = await validateSession();
  if (!sessionUser) {
    redirect("/login");
  }

  const snippetsList = await getSnippets();

  return <SnippetsClient user={{ username: sessionUser.username }} snippetsList={snippetsList} />;
}
