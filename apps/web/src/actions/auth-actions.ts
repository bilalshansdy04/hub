"use server";

import { verifySecret, createSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const secret = formData.get("secret") as string;

  if (!secret) {
    return { error: "Masukkan PIN atau Master Password." };
  }

  const isValid = await verifySecret(secret);
  if (!isValid) {
    return { error: "PIN atau Password salah." };
  }

  await createSessionCookie();
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
