import { NextResponse } from "next/server";
import { getPlatformVisitors } from "@/lib/server/platform-data";

export async function GET() {
  return NextResponse.json({ visitors: await getPlatformVisitors() });
}
