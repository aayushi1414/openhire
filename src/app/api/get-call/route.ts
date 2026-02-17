import { analyzeCall } from "@/actions/call.actions";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  logger.info("get-call request received");

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    const result = await analyzeCall(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    logger.error("Error analyzing call");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
