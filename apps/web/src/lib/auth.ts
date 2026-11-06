import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "shrimphub_session";
const DEFAULT_SECRET = process.env.SHRIMPHUB_SECRET || "shrimp2026";

/**
 * Validates the user's PIN / password
 */
export async function verifySecret(secret: string): Promise<boolean> {
  const masterSecret = process.env.SHRIMPHUB_SECRET || DEFAULT_SECRET;
  return secret.trim() === masterSecret.trim();
}

/**
 * Creates and sets an HTTP-only session cookie
 */
export async function createSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  cookieStore.set(SESSION_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Removes session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Checks if current request has valid session cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === "authenticated";
}
