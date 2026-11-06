"use server";

import { db, comics } from "@shrimphub/database";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getComics() {
  try {
    return await db.select().from(comics).orderBy(desc(comics.updatedAt));
  } catch (error) {
    console.error("Failed to fetch comics:", error);
    return [];
  }
}

export async function incrementChapterAction(comicId: string) {
  try {
    const found = await db.select().from(comics).where(eq(comics.id, comicId)).limit(1);
    if (found.length === 0) return { success: false, error: "Komik tidak ditemukan." };

    const newChapter = found[0].currentChapter + 1;
    await db
      .update(comics)
      .set({
        currentChapter: newChapter,
        updatedAt: new Date(),
      })
      .where(eq(comics.id, comicId));

    revalidatePath("/");
    return { success: true, newChapter };
  } catch (error) {
    console.error("Error incrementing chapter:", error);
    return { success: false, error: "Gagal update chapter." };
  }
}

export async function addComicAction(formData: FormData) {
  const title = formData.get("title") as string;
  const sourceUrl = (formData.get("sourceUrl") as string) || "";
  const coverUrl = (formData.get("coverUrl") as string) || "";
  const currentChapter = parseFloat((formData.get("currentChapter") as string) || "1");

  if (!title) return { success: false, error: "Judul komik harus diisi." };

  try {
    const id = `comic-${Date.now()}`;
    await db.insert(comics).values({
      id,
      title,
      sourceUrl,
      coverUrl,
      currentChapter,
      status: "reading",
      updatedAt: new Date(),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding comic:", error);
    return { success: false, error: "Gagal menambahkan komik." };
  }
}
