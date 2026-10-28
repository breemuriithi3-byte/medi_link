import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { errorResponse, jsonError } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Please provide a name, valid email and password of at least 8 characters.");
    const { name, email, password, role } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return errorResponse("An account with that email already exists.", 409);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role, patientProfile: role === "PATIENT" ? { create: {} } : undefined } });
    await createSession({ id: user.id, role: user.role, name: user.name, email: user.email });
    return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
