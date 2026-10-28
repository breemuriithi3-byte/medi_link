import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { errorResponse, jsonError } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.email !== "string" || typeof body.password !== "string") return errorResponse("Email and password are required.");
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) return errorResponse("Invalid email or password.", 401);
    await createSession({ id: user.id, role: user.role, name: user.name, email: user.email });
    return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) { return jsonError(error); }
}
