import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ status: "ok", service: "medilink-ai", timestamp: new Date().toISOString() }); }
