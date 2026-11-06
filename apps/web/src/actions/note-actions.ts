"use server";

import { db, notes, eq, desc } from "@shrimphub/database";
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

export async function getAllNotes() {
  try {
    return await db.select().from(notes).orderBy(desc(notes.updatedAt));
  } catch (err) {
    console.error("Error fetching notes:", err);
    return [];
  }
}

export async function saveNoteAction(content: string, noteId?: string, title?: string) {
  try {
    if (noteId) {
      await db
        .update(notes)
        .set({
          content,
          title: title || undefined,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, noteId));
    } else {
      await db.insert(notes).values({
        id: `note-${Date.now()}`,
        title: title || "Catatan Baru",
        content,
        isPinned: false,
        updatedAt: new Date(),
      });
    }

    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true };
  } catch (err) {
    console.error("Error saving note:", err);
    return { success: false };
  }
}

export async function deleteNoteAction(noteId: string) {
  try {
    await db.delete(notes).where(eq(notes.id, noteId));
    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true };
  } catch (err) {
    console.error("Error deleting note:", err);
    return { success: false };
  }
}
