import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";
import { getEngine } from "@/lib/engine";
import {
  validateGarmentIntake,
  checkImageWarnings,
} from "@/lib/validation/garment-schema";

export interface SellerProduct {
  garment_id: string;
  seller_id: string;
  name: string;
  category: string;
  images: {
    front: string;
    side?: string;
    back?: string;
    hero?: string;
  };
  material_token: string;
  size_range?: { min?: string; max?: string };
  description?: string;
  status: "draft" | "processing" | "ready" | "error";
  created_at: string;
  updated_at: string;
  engine_asset?: unknown;
  warnings?: Array<{ field: string; level: string; message: string }>;
}

/**
 * GET /api/seller/products?seller_id=xxx
 * 상품 목록 조회
 */
export async function GET(req: NextRequest) {
  const sellerId =
    req.nextUrl.searchParams.get("seller_id") ?? "demo-seller";
  const storage = getStorage();
  const all = await storage.list<SellerProduct>("products");
  const filtered = all.filter((p) => p.seller_id === sellerId);
  return NextResponse.json({ products: filtered, count: filtered.length });
}

/**
 * POST /api/seller/products
 * 상품 등록 — Ajv 스키마 검증 + 이미지 경고 gate
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Schema validation (Ajv gate)
    const valid = validateGarmentIntake(body);
    if (!valid) {
      return NextResponse.json(
        {
          error: "Schema validation failed",
          details: validateGarmentIntake.errors,
        },
        { status: 400 }
      );
    }

    // Image quality warnings
    const imageWarnings = checkImageWarnings(body.images);
    const hasError = imageWarnings.some((w) => w.level === "error");
    if (hasError) {
      return NextResponse.json(
        {
          error: "Image validation failed",
          warnings: imageWarnings,
        },
        { status: 400 }
      );
    }

    // 타입 안전한 필드 추출
    const garment_id = body.garment_id as string;
    const seller_id = body.seller_id as string;
    const name = body.name as string;
    const category = body.category as string;
    const images = body.images as { front: string; side?: string; back?: string; hero?: string };
    const material_token = body.material_token as string;

    // Engine에 garment 등록
    const engine = getEngine();
    const asset = await engine.registerGarment({
      garment_id,
      seller_id,
      images,
      material_token,
    });

    // Storage에 저장
    const product: SellerProduct = {
      garment_id,
      seller_id,
      name,
      category,
      images,
      material_token,
      size_range: body.size_range as { min?: string; max?: string } | undefined,
      description: body.description as string | undefined,
      status: "ready",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      engine_asset: asset,
      warnings: imageWarnings.filter((w) => w.level !== "error"),
    };

    const storage = getStorage();
    await storage.write("products", product.garment_id, product);

    return NextResponse.json({ product, warnings: imageWarnings });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
