import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "development-only-secret-change-me");
const COOKIE = "medilink_session";

export async function createSession(user: { id: string; role: Role; name: string; email: string }) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload as { id: string; role: Role; name: string; email: string }; }
  catch { return null; }
}

export function clearSession() { cookies().delete(COOKIE); }

export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Error("UNAUTHORIZED");
  return session;
}
