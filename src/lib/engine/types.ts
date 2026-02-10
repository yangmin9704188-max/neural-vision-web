/**
 * Neural Vision Engine — shared types
 *
 * These types mirror the pipeline contracts:
 *   docs/PIPELINE_MAP_MASTER_v1.md
 *
 * Real payloads will be validated against JSON schemas from
 * the contracts repo (once pinned).
 */

// ── Body Module ──────────────────────────────────────────────

export interface BodyRequest {
  gender: "male" | "female";
  age: number;
  height_cm: number;
  weight_kg: number;
}

export interface BodyResult {
  prototype_id: string;
  body_measurements_subset: Record<string, number>;
  mesh_ref?: string; // internal reference to body_mesh.npz
}

// ── Garment Module ───────────────────────────────────────────

export interface GarmentIntake {
  garment_id: string;
  seller_id: string;
  images: {
    front: string;
    side?: string;
    back?: string;
    hero?: string;
  };
  material_token?: string;
}

export interface GarmentAsset {
  garment_id: string;
  embedding_ref: string; // path to embedding.pt
  latent_meta: Record<string, unknown>;
}

// ── Fitting Module ───────────────────────────────────────────

export interface FittingRequest {
  job_id: string;
  body: BodyResult;
  garment: GarmentAsset;
}

export interface FittingResult {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  artifacts?: {
    depth_png?: string;
    normal_png?: string;
    fit_signal?: Record<string, unknown>;
    final_image?: string;
  };
  provenance?: Record<string, unknown>;
}

// ── Job ──────────────────────────────────────────────────────

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  job_id: string;
  seller_id: string;
  garment_id: string;
  body_request: BodyRequest;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  result?: FittingResult;
}
