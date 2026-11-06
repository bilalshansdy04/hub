import { cookies } from "next/headers";
import { db, users, sessions, eq } from "@shrimphub/database";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "shrimphub_session_token";
export const SESSION_TTL_DAYS = 7;
export const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;

// ==========================================
// 1. Password Hashing (PBKDF2 with Salt)
// ==========================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}

// ==========================================
// 2. User Queries
// ==========================================

export async function hasRegisteredUsers(): Promise<boolean> {
  try {
    const all = await db.select({ id: users.id }).from(users).limit(1);
    return all.length > 0;
  } catch (err) {
    console.error("Error checking users count:", err);
    return false;
  }
}

export async function getUserByUsername(username: string) {
  const found = await db.select().from(users).where(eq(users.username, username.trim())).limit(1);
  return found[0] || null;
}

// ==========================================
// 3. Sliding / Rolling Session (7-Day Inactivity)
// ==========================================

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    id: token,
    userId,
    expiresAt,
    createdAt: new Date(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function validateAndRefreshSession(): Promise<{ userId: string; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const now = new Date();

  const activeSessions = await db
    .select({
      sessionToken: sessions.id,
      userId: users.id,
      username: users.username,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1);

  if (activeSessions.length === 0) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  const session = activeSessions[0];

  if (session.expiresAt.getTime() <= now.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, token));
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  const newExpiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await db
    .update(sessions)
    .set({ expiresAt: newExpiresAt })
    .where(eq(sessions.id, token));

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: newExpiresAt,
    path: "/",
  });

  return { userId: session.userId, username: session.username };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, token));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
