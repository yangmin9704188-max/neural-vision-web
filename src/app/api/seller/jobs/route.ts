import { NextRequest, NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getStorage } from "@/lib/storage";
import type { BodyRequest } from "@/lib/engine";

interface JobSubmission {
  seller_id: string;
  garment_id: string;
  body_request: BodyRequest;
}

/**
 * GET /api/seller/jobs?seller_id=xxx
 * Seller의 Job 목록
 */
export async function GET(req: NextRequest) {
  const sellerId =
    req.nextUrl.searchParams.get("seller_id") ?? "mock-seller";
  const engine = getEngine();
  const jobs = await engine.listJobs(sellerId);
  return NextResponse.json({ jobs, count: jobs.length });
}

/**
 * POST /api/seller/jobs
 * 새 피팅 Job 제출
 *
 * Flow: Body Module → Garment 조회 → Fitting+Generation → Job 저장
 */
export async function POST(req: NextRequest) {
  try {
    const submission: JobSubmission = await req.json();

    if (!submission.garment_id || !submission.body_request) {
      return NextResponse.json(
        { error: "garment_id and body_request are required" },
        { status: 400 }
      );
    }

    const engine = getEngine();
    const storage = getStorage();

    // 1. Body Module 실행
    const bodyResult = await engine.submitBody(submission.body_request);

    // 2. Garment 조회 (storage에서)
    const product = await storage.read<{ engine_asset?: { garment_id: string; embedding_ref: string; latent_meta: Record<string, unknown> } }>(
      "products",
      submission.garment_id
    );

    const garmentAsset = product?.engine_asset ?? {
      garment_id: submission.garment_id,
      embedding_ref: `mock://embedding/${submission.garment_id}.pt`,
      latent_meta: { version: "mock-v0" },
    };

    // 3. Fitting + Generation 실행
    const job = await engine.submitJob({
      job_id: `job_${Date.now()}`,
      body: bodyResult,
      garment: garmentAsset,
    });

    // Job에 seller_id 설정
    const enrichedJob = {
      ...job,
      seller_id: submission.seller_id ?? "demo-seller",
    };

    // 4. Storage에 저장
    await storage.write("jobs", enrichedJob.job_id, enrichedJob);

    return NextResponse.json(enrichedJob);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
