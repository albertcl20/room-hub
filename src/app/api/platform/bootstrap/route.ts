import { NextResponse } from "next/server";
import { bootstrapDemoWorkspace } from "@/lib/server/bootstrap";

export async function POST() {
  try {
    const result = await bootstrapDemoWorkspace();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Bootstrap failed",
      },
      { status: 500 },
    );
  }
}
