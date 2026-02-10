/**
 * EngineClient — abstract interface for the Neural Vision Engine.
 *
 * Consumers (pages, API routes) import this interface only.
 * The actual implementation is swapped via environment:
 *   - NEXT_PUBLIC_ENGINE_MODE=mock  → MockEngineClient
 *   - NEXT_PUBLIC_ENGINE_MODE=real  → RealEngineClient (PR-D)
 */

import type {
  BodyRequest,
  BodyResult,
  GarmentIntake,
  GarmentAsset,
  FittingRequest,
  Job,
} from "./types";

export interface EngineClient {
  // Body
  submitBody(req: BodyRequest): Promise<BodyResult>;

  // Garment
  registerGarment(intake: GarmentIntake): Promise<GarmentAsset>;

  // Fitting / Jobs
  submitJob(req: FittingRequest): Promise<Job>;
  getJob(jobId: string): Promise<Job>;
  listJobs(sellerId: string): Promise<Job[]>;

  // Health
  ping(): Promise<{ ok: boolean; mode: "mock" | "real" }>;
}
