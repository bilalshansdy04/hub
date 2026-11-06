"use server";

import { db, tasks, eq, desc } from "@shrimphub/database";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  try {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

export async function toggleTaskAction(taskId: string) {
  try {
    const found = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    if (found.length === 0) return { success: false };

    await db
      .update(tasks)
      .set({ isDone: !found[0].isDone })
      .where(eq(tasks.id, taskId));

    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true, isDone: !found[0].isDone };
  } catch (err) {
    console.error("Error toggling task:", err);
    return { success: false };
  }
}

export async function addTaskAction(title: string, priority: "low" | "medium" | "high" = "medium") {
  if (!title.trim()) return { success: false };
  try {
    await db.insert(tasks).values({
      id: `task-${Date.now()}`,
      title: title.trim(),
      isDone: false,
      priority,
      createdAt: new Date(),
    });

    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true };
  } catch (err) {
    console.error("Error adding task:", err);
    return { success: false };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { success: false };
  }
}
