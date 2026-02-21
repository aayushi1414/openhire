import { NextResponse } from "next/server";
import { registerCall } from "@/actions/call";

export async function POST(req: Request) {
  const body = await req.json();
  const { interviewerId, dynamicData } = body;
  const result = await registerCall(Number(interviewerId), dynamicData);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
