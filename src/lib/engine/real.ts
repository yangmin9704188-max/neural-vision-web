/**
 * RealEngineClient — HTTP 기반 실제 Neural Vision Engine 어댑터.
 *
 * NEXT_PUBLIC_ENGINE_MODE=real 설정 시 활성화됩니다.
 * 환경변수:
 *   - ENGINE_API_BASE_URL: 엔진 API 베이스 URL (필수)
 *   - ENGINE_API_KEY: 인증 키 (선택)
 *
 * 모든 요청은 EngineClient 인터페이스를 그대로 따르므로
 * UI 코드 변경 없이 mock ↔ real 전환이 가능합니다.
 */

import type { EngineClient } from "./client";
import type {
  BodyRequest,
  BodyResult,
  GarmentIntake,
  GarmentAsset,
  FittingRequest,
  Job,
} from "./types";

export class RealEngineClient implements EngineClient {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    const baseUrl = process.env.ENGINE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "ENGINE_API_BASE_URL is required when NEXT_PUBLIC_ENGINE_MODE=real"
      );
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = process.env.ENGINE_API_KEY;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Engine API error [${res.status}]: ${text}`
      );
    }

    return res.json() as Promise<T>;
  }

  async submitBody(req: BodyRequest): Promise<BodyResult> {
    return this.request<BodyResult>("POST", "/api/body", req);
  }

  async registerGarment(intake: GarmentIntake): Promise<GarmentAsset> {
    return this.request<GarmentAsset>("POST", "/api/garment", intake);
  }

  async submitJob(req: FittingRequest): Promise<Job> {
    return this.request<Job>("POST", "/api/job", req);
  }

  async getJob(jobId: string): Promise<Job> {
    return this.request<Job>("GET", `/api/job/${jobId}`);
  }

  async listJobs(sellerId: string): Promise<Job[]> {
    return this.request<Job[]>(
      "GET",
      `/api/jobs?seller_id=${encodeURIComponent(sellerId)}`
    );
  }

  async ping(): Promise<{ ok: boolean; mode: "mock" | "real" }> {
    try {
      const result = await this.request<{ ok: boolean }>(
        "GET",
        "/api/ping"
      );
      return { ...result, mode: "real" };
    } catch {
      return { ok: false, mode: "real" };
    }
  }
}
