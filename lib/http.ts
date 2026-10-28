import { NextResponse } from "next/server";
export function errorResponse(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
export function jsonError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") return errorResponse("Authentication required", 401);
  console.error(error);
  return errorResponse("Something went wrong", 500);
}
