import { NextResponse } from "next/server";
import { getPlatformOverview } from "@/lib/server/platform-data";

export async function GET() {
  return NextResponse.json(await getPlatformOverview());
}
