import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";

const SESSION_SECRET = process.env.SESSION_SECRET || "optometry-secret";
const COOKIE_NAME = "optometry-session";
const SESSION_DURATION_DAYS = 7;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(attempt, "hex"));
  } catch { return false; }
}

function signSession(payload: any): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifySessionToken(token: string): any {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

export function createSession(userId: string, email: string, role: string): string {
  const payload = { userId, email, role, exp: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000 };
  return signSession(payload);
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60, path: "/",
  });
}

export function clearSessionCookie() { cookies().delete(COOKIE_NAME); }

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
