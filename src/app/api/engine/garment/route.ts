import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import type { GarmentIntake } from "@/lib/engine";

/**
 * POST /api/engine/garment
 *
 * Garment Module:
 *   입력 → Seller Intake Contract (G0): images, material_token
 *   출력 → GarmentAsset (embedding_ref, latent_meta)
 */
export async function POST(req: NextRequest) {
  try {
    const intake: GarmentIntake = await req.json();

    if (!intake.garment_id || !intake.seller_id) {
      return NextResponse.json(
        { error: "garment_id, seller_id are required" },
        { status: 400 }
      );
    }

    const engine = getEngine();
    const result = await engine.registerGarment(intake);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
