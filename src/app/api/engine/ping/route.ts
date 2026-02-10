import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";

export async function GET() {
  const engine = getEngine();
  const result = await engine.ping();
  return NextResponse.json(result);
}
