/**
 * MockEngineClient — in-memory mock implementation of EngineClient.
 *
 * Used for development and demo mode. Returns deterministic placeholder
 * data so the UI can be built and tested without the real engine.
 *
 * TODO (PR-A): Populate with contracts/examples smoke data (3 scenarios).
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

// ── In-memory stores ─────────────────────────────────────────

const jobs = new Map<string, Job>();
let jobCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${++jobCounter}`;
}

// ── MockEngineClient ─────────────────────────────────────────

export class MockEngineClient implements EngineClient {
  async submitBody(req: BodyRequest): Promise<BodyResult> {
    // Deterministic prototype selection (placeholder logic)
    const heightBin = Math.floor(req.height_cm / 5) * 5;
    const prototypeId = `proto_${req.gender}_${heightBin}`;

    return {
      prototype_id: prototypeId,
      body_measurements_subset: {
        height_cm: req.height_cm,
        weight_kg: req.weight_kg,
        chest_cm: 90 + Math.random() * 10,
        waist_cm: 75 + Math.random() * 10,
      },
      mesh_ref: `mock://body_mesh/${prototypeId}.npz`,
    };
  }

  async registerGarment(intake: GarmentIntake): Promise<GarmentAsset> {
    return {
      garment_id: intake.garment_id || generateId("garment"),
      embedding_ref: `mock://embedding/${intake.garment_id}.pt`,
      latent_meta: {
        version: "mock-v0",
        material_token: intake.material_token ?? "unknown",
      },
    };
  }

  async submitJob(req: FittingRequest): Promise<Job> {
    const job: Job = {
      job_id: req.job_id || generateId("job"),
      seller_id: "mock-seller",
      garment_id: req.garment.garment_id,
      body_request: {
        gender: "male",
        age: 30,
        height_cm: 175,
        weight_kg: 70,
      },
      status: "completed" as JobStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      result: {
        job_id: req.job_id,
        status: "completed",
        artifacts: {
          depth_png: "mock://artifacts/depth.png",
          normal_png: "mock://artifacts/normal.png",
          final_image: "mock://artifacts/final_layer_result.png",
        },
        provenance: {
          engine_mode: "mock",
          pipeline_version: "v0.1.0",
        },
      },
    };

    jobs.set(job.job_id, job);
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job = jobs.get(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    return job;
  }

  async listJobs(sellerId: string): Promise<Job[]> {
    return Array.from(jobs.values()).filter((j) => j.seller_id === sellerId);
  }

  async ping(): Promise<{ ok: boolean; mode: "mock" | "real" }> {
    return { ok: true, mode: "mock" };
  }
}
