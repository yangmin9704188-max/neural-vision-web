import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import type { BodyRequest } from "@/lib/engine";

/**
 * POST /api/engine/body
 *
 * Online Body Module:
 *   입력 → gender, age, height_cm, weight_kg
 *   출력 → prototype_id, body_measurements_subset, mesh_ref
 */
export async function POST(req: NextRequest) {
  try {
    const body: BodyRequest = await req.json();

    // 기본 검증
    if (!body.gender || !body.height_cm || !body.weight_kg) {
      return NextResponse.json(
        { error: "gender, height_cm, weight_kg are required" },
        { status: 400 }
      );
    }

    const engine = getEngine();
    const result = await engine.submitBody(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
