"use server";

import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getUserByUsername,
  hasRegisteredUsers,
} from "@/lib/auth";
import { db, users } from "@shrimphub/database";
import { redirect } from "next/navigation";

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function checkHasUsers(): Promise<boolean> {
  return await hasRegisteredUsers();
}

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const pinCode = ((formData.get("pinCode") as string) || "").trim();

  if (!username || username.length < 3) {
    return { error: "Username minimal 3 karakter." };
  }

  if (!password || password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const existing = await getUserByUsername(username);
  if (existing) {
    return { error: "Username sudah digunakan, silakan pilih yang lain." };
  }

  try {
    const userId = `usr-${Date.now()}`;
    const passwordHash = hashPassword(password);

    await db.insert(users).values({
      id: userId,
      username,
      passwordHash,
      pinCode: pinCode || null,
      createdAt: new Date(),
    });

    // Create 7-day rolling session
    await createSession(userId);
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Terjadi kesalahan saat mendaftarkan akun." };
  }

  redirect("/");
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return { error: "Username atau password salah." };
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash);
  const isPinValid = user.pinCode && user.pinCode === password;

  if (!isPasswordValid && !isPinValid) {
    return { error: "Username atau password salah." };
  }

  try {
    // Create 7-day rolling session
    await createSession(user.id);
  } catch (err) {
    console.error("Login session error:", err);
    return { error: "Gagal membuat sesi login." };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
