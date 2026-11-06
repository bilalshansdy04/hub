"use server";

import { db, notes, eq } from "@shrimphub/database";
import { revalidatePath } from "next/cache";

export async function getPinnedNote() {
  try {
    const list = await db.select().from(notes).where(eq(notes.isPinned, true)).limit(1);
    return list[0] || null;
  } catch (err) {
    console.error("Error fetching note:", err);
    return null;
  }
}

export async function saveNoteAction(content: string, noteId?: string) {
  try {
    if (noteId) {
      await db
        .update(notes)
        .set({ content, updatedAt: new Date() })
        .where(eq(notes.id, noteId));
    } else {
      await db.insert(notes).values({
        id: `note-${Date.now()}`,
        title: "Scratchpad Harian",
        content,
        isPinned: true,
        updatedAt: new Date(),
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error saving note:", err);
    return { success: false };
  }
}
