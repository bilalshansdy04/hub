"use server";

import { db, snippets, eq, desc } from "@shrimphub/database";
import { revalidatePath } from "next/cache";

export async function getSnippets() {
  try {
    return await db.select().from(snippets).orderBy(desc(snippets.createdAt));
  } catch (error) {
    console.error("Failed to fetch snippets:", error);
    return [];
  }
}

export async function saveSnippetAction(data: {
  title: string;
  language: string;
  code: string;
  theme?: string;
  padding?: number;
}) {
  try {
    const id = `snip-${Date.now()}`;
    await db.insert(snippets).values({
      id,
      title: data.title || "Untitled Snippet",
      language: data.language || "typescript",
      code: data.code,
      theme: data.theme || "aurora",
      createdAt: new Date(),
    });

    revalidatePath("/snippets");
    return { success: true, id };
  } catch (error) {
    console.error("Error saving snippet:", error);
    return { success: false, error: "Gagal menyimpan snippet." };
  }
}

export async function deleteSnippetAction(snippetId: string) {
  try {
    await db.delete(snippets).where(eq(snippets.id, snippetId));
    revalidatePath("/snippets");
    return { success: true };
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return { success: false };
  }
}
