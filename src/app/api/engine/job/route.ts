import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import type { FittingRequest } from "@/lib/engine";

/**
 * POST /api/engine/job
 *
 * Fitting + Generation Pipeline:
 *   입력 → body result + garment asset
 *   출력 → Job (fitting result with artifacts)
 *
 * Pipeline Flow:
 *   Body Output + Garment Output → SDF Collision Solver → Generation → final_layer_result.png
 */
export async function POST(req: NextRequest) {
  try {
    const fittingReq: FittingRequest = await req.json();

    if (!fittingReq.body || !fittingReq.garment) {
      return NextResponse.json(
        { error: "body and garment are required" },
        { status: 400 }
      );
    }

    const engine = getEngine();
    const job = await engine.submitJob(fittingReq);
    return NextResponse.json(job);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
