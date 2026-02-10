/**
 * MockEngineClient — in-memory mock implementation of EngineClient.
 *
 * 파이프라인 문서 기반 3종 smoke 시나리오 데이터를 반환합니다.
 * Pipeline: Body → Garment → Fitting(SDF Collision) → Generation(ControlNet+IP-Adapter)
 */

import type { EngineClient } from "./client";
import type {
  BodyRequest,
  BodyResult,
  GarmentIntake,
  GarmentAsset,
  FittingRequest,
  Job,
  JobStatus,
} from "./types";
import { SMOKE_SCENARIOS } from "./smoke-scenarios";

// ── In-memory stores ─────────────────────────────────────────

const jobs = new Map<string, Job>();
const garments = new Map<string, GarmentAsset>();
let jobCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++jobCounter}`;
}

/**
 * 2cm 양자화(Quantization)로 Prototype Bank 매칭
 * — PIPELINE_MAP: "2cm 단위 양자화를 통해 Prototype Bank에서 최적 모델 선택"
 */
function quantizeHeight(height_cm: number): number {
  return Math.round(height_cm / 2) * 2;
}

/**
 * BMI 기반 체형 빈 계산
 * — PIPELINE_MAP: "성별(2) × 키(8) × BMI(6) × 연령(4)"
 */
function calcBmiBin(weight_kg: number, height_cm: number): number {
  const bmi = weight_kg / ((height_cm / 100) ** 2);
  if (bmi < 18.5) return 0;
  if (bmi < 22) return 1;
  if (bmi < 25) return 2;
  if (bmi < 28) return 3;
  if (bmi < 32) return 4;
  return 5;
}

// ── MockEngineClient ─────────────────────────────────────────

export class MockEngineClient implements EngineClient {
  /**
   * Online Body Module
   * 입력: gender, age, height_cm, weight_kg
   * 출력: prototype_id, body_measurements_subset, mesh_ref
   */
  async submitBody(req: BodyRequest): Promise<BodyResult> {
    // smoke 시나리오에 매칭되면 해당 데이터 반환
    const match = SMOKE_SCENARIOS.find(
      (s) =>
        s.body_request.gender === req.gender &&
        Math.abs(s.body_request.height_cm - req.height_cm) < 3 &&
        Math.abs(s.body_request.weight_kg - req.weight_kg) < 5
    );
    if (match) return match.expected_body;

    // 일반 케이스: 양자화 기반 프로토타입 매핑
    const qHeight = quantizeHeight(req.height_cm);
    const bmiBin = calcBmiBin(req.weight_kg, req.height_cm);
    const prototypeId = `proto_${req.gender}_${qHeight}_bmi${bmiBin}`;

    const bmi = req.weight_kg / ((req.height_cm / 100) ** 2);
    const chestBase = req.gender === "male" ? 88 : 80;
    const waistBase = req.gender === "male" ? 76 : 64;

    return {
      prototype_id: prototypeId,
      body_measurements_subset: {
        height_cm: req.height_cm,
        weight_kg: req.weight_kg,
        chest_cm: Math.round((chestBase + bmi * 0.8) * 10) / 10,
        waist_cm: Math.round((waistBase + bmi * 0.9) * 10) / 10,
        hip_cm: Math.round((chestBase - 2 + bmi * 0.6) * 10) / 10,
        shoulder_width_cm:
          Math.round((req.gender === "male" ? 42 : 36 + bmi * 0.2) * 10) / 10,
      },
      mesh_ref: `mock://body_mesh/${prototypeId}.npz`,
    };
  }

  /**
   * Garment Module (오프라인 → 온라인 프록시)
   * 입력: seller intake contract (G0)
   * 출력: garment latent asset (embedding + meta)
   */
  async registerGarment(intake: GarmentIntake): Promise<GarmentAsset> {
    const asset: GarmentAsset = {
      garment_id: intake.garment_id || generateId("garment"),
      embedding_ref: `mock://embedding/${intake.garment_id}.pt`,
      latent_meta: {
        version: "mock-v0",
        material_token: intake.material_token ?? "cotton_basic",
        texture_dna_ready: true,
        reprocess_flag: false,
      },
    };
    garments.set(asset.garment_id, asset);
    return asset;
  }

  /**
   * Online Fitting + Generation Pipeline
   * Fitting: SDF Collision Solver → fit_signal.json, depth.png, normal.png
   * Generation: ControlNet + IP-Adapter → final_layer_result.png
   */
  async submitJob(req: FittingRequest): Promise<Job> {
    // smoke 시나리오 매칭
    const match = SMOKE_SCENARIOS.find(
      (s) =>
        s.expected_body.prototype_id === req.body.prototype_id ||
        s.body_request.height_cm ===
          req.body.body_measurements_subset.height_cm
    );

    const jobId = req.job_id || generateId("job");
    const job: Job = {
      job_id: jobId,
      seller_id: "mock-seller",
      garment_id: req.garment.garment_id,
      body_request: {
        gender: req.body.prototype_id.includes("female") ? "female" : "male",
        age: 30,
        height_cm:
          req.body.body_measurements_subset.height_cm ??
          (req.body.prototype_id.includes("female") ? 163 : 175),
        weight_kg:
          req.body.body_measurements_subset.weight_kg ??
          (req.body.prototype_id.includes("female") ? 55 : 70),
      },
      status: "completed" as JobStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      result: match
        ? match.expected_result
        : {
            job_id: jobId,
            status: "completed",
            artifacts: {
              depth_png: "/demo_artifacts/samples/smoke1_depth.png",
              normal_png: "/demo_artifacts/samples/smoke1_normal.png",
              fit_signal: {
                collision_count: 0,
                retry_count: 0,
                quality_score: 0.88,
              },
              final_image: "/demo_artifacts/samples/smoke1_final.png",
            },
            provenance: {
              engine_mode: "mock",
              pipeline_version: "v0.1.0",
              body_prototype: req.body.prototype_id,
              sdf_bank_version: "mock-v0",
              generation_method: "ControlNet+IP-Adapter",
            },
          },
    };

    jobs.set(job.job_id, job);
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job = jobs.get(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);
    return job;
  }

  async listJobs(sellerId: string): Promise<Job[]> {
    return Array.from(jobs.values()).filter((j) => j.seller_id === sellerId);
  }

  async ping(): Promise<{ ok: boolean; mode: "mock" | "real" }> {
    return { ok: true, mode: "mock" };
  }
}
