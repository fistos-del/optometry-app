import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createSession(user.id, user.email, user.role);
    setSessionCookie(token);
    return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
