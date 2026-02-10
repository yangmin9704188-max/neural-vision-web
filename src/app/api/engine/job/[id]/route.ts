import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";

/**
 * GET /api/engine/job/:id
 *
 * Job 상태 조회 — 아티팩트 포함
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const engine = getEngine();
    const job = await engine.getJob(id);
    return NextResponse.json(job);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Job not found" },
      { status: 404 }
    );
  }
}
