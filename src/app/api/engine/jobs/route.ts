import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";

/**
 * GET /api/engine/jobs?seller_id=xxx
 *
 * Seller의 전체 Job 목록 조회
 */
export async function GET(req: NextRequest) {
  try {
    const sellerId =
      req.nextUrl.searchParams.get("seller_id") ?? "mock-seller";
    const engine = getEngine();
    const jobList = await engine.listJobs(sellerId);
    return NextResponse.json({ jobs: jobList, count: jobList.length });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
