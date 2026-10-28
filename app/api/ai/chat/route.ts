import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonError } from "@/lib/http";
const safety = "You are MediLink AI, a cautious health education assistant. Give general educational information, never diagnose or prescribe, state uncertainty, recommend a qualified clinician when appropriate, and direct potentially life-threatening symptoms to local emergency services. Keep answers concise and plain-language.";
export async function POST(request: Request) {
  try {
    const session = await getSession(); if (!session) return errorResponse("Authentication required", 401);
    const body = await request.json(); if (typeof body.message !== "string" || body.message.trim().length < 3 || body.message.length > 2000) return errorResponse("Please enter a question between 3 and 2,000 characters.");
    const message = body.message.trim();
    if (/(chest pain|can't breathe|cannot breathe|severe bleeding|unconscious|stroke symptoms)/i.test(message)) return NextResponse.json({ answer: "This may be an emergency. Please call your local emergency service now or go to the nearest emergency department. Do not wait for an online response." });
    let answer = "MediLink AI is not configured yet. Add AI_API_KEY to enable the connected language-model service. For general health information, please consult a qualified healthcare professional.";
    if (process.env.AI_API_KEY) {
      const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.AI_API_KEY}` }, body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "system", content: safety }, { role: "user", content: message }] }) });
      if (!response.ok) return errorResponse("The AI service is temporarily unavailable. Please try again later.", 502);
      const data = await response.json(); answer = data.choices?.[0]?.message?.content || answer;
    }
    await prisma.aiConversation.create({ data: { userId: session.id, title: message.slice(0, 80), messages: [{ role: "user", content: message }, { role: "assistant", content: answer }] } });
    return NextResponse.json({ answer });
  } catch (error) { return jsonError(error); }
}
