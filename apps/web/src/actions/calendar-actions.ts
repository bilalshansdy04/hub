"use server";

import { db, scheduleBlocks, eq, desc } from "@shrimphub/database";
import { revalidatePath } from "next/cache";

export async function getScheduleBlocks() {
  try {
    return await db.select().from(scheduleBlocks).orderBy(scheduleBlocks.startTime);
  } catch (error) {
    console.error("Failed to fetch schedule blocks:", error);
    return [];
  }
}

export async function addScheduleBlockAction(formData: {
  title: string;
  category: "focus" | "routine" | "meeting" | "rest";
  startTime: string; // ISO string
  endTime: string;   // ISO string
  color?: string;
}) {
  try {
    const id = `block-${Date.now()}`;
    await db.insert(scheduleBlocks).values({
      id,
      title: formData.title,
      category: formData.category,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      isCompleted: false,
      color: formData.color || "#8b5cf6",
    });

    revalidatePath("/calendar");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding schedule block:", error);
    return { success: false, error: "Gagal menambahkan jadwal." };
  }
}

export async function toggleScheduleBlockAction(blockId: string) {
  try {
    const found = await db.select().from(scheduleBlocks).where(eq(scheduleBlocks.id, blockId)).limit(1);
    if (found.length === 0) return { success: false };

    await db
      .update(scheduleBlocks)
      .set({ isCompleted: !found[0].isCompleted })
      .where(eq(scheduleBlocks.id, blockId));

    revalidatePath("/calendar");
    revalidatePath("/");
    return { success: true, isCompleted: !found[0].isCompleted };
  } catch (error) {
    console.error("Error toggling block:", error);
    return { success: false };
  }
}

export async function deleteScheduleBlockAction(blockId: string) {
  try {
    await db.delete(scheduleBlocks).where(eq(scheduleBlocks.id, blockId));
    revalidatePath("/calendar");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting block:", error);
    return { success: false };
  }
}
