/**
 * 3종 Smoke Test 시나리오
 *
 * 파이프라인 문서(docs/PIPELINE_MAP_MASTER_v1.md) 기반:
 *   Online Phase → Body → Garment → Fitting → Generation
 *
 * 각 시나리오는 사용자 입력(BodyRequest)부터 최종 결과(FittingResult)까지
 * 전체 파이프라인을 mock 데이터로 커버합니다.
 */

import type { BodyRequest, BodyResult, FittingResult } from "./types";

export interface SmokeScenario {
  id: string;
  label: string;
  description: string;
  garment_type: string;
  body_request: BodyRequest;
  expected_body: BodyResult;
  expected_result: FittingResult;
}

export const SMOKE_SCENARIOS: SmokeScenario[] = [
  {
    id: "smoke-1-male-tshirt",
    label: "남성 T셔츠 피팅",
    description: "평균 체형 남성, 기본 면 티셔츠",
    garment_type: "t-shirt",
    body_request: {
      gender: "male",
      age: 28,
      height_cm: 175,
      weight_kg: 70,
    },
    expected_body: {
      prototype_id: "proto_male_175",
      body_measurements_subset: {
        height_cm: 175,
        weight_kg: 70,
        chest_cm: 95.2,
        waist_cm: 80.1,
        hip_cm: 94.5,
        shoulder_width_cm: 44.8,
      },
      mesh_ref: "mock://body_mesh/proto_male_175.npz",
    },
    expected_result: {
      job_id: "smoke-1-male-tshirt",
      status: "completed",
      artifacts: {
        depth_png: "/demo_artifacts/samples/smoke1_depth.png",
        normal_png: "/demo_artifacts/samples/smoke1_normal.png",
        fit_signal: {
          collision_count: 0,
          retry_count: 0,
          quality_score: 0.95,
        },
        final_image: "/demo_artifacts/samples/smoke1_final.png",
      },
      provenance: {
        engine_mode: "mock",
        pipeline_version: "v0.1.0",
        body_prototype: "proto_male_175",
        sdf_bank_version: "mock-v0",
        generation_method: "ControlNet+IP-Adapter",
      },
    },
  },
  {
    id: "smoke-2-female-blouse",
    label: "여성 블라우스 피팅",
    description: "소형 체형 여성, 실크 블라우스",
    garment_type: "blouse",
    body_request: {
      gender: "female",
      age: 32,
      height_cm: 163,
      weight_kg: 55,
    },
    expected_body: {
      prototype_id: "proto_female_163",
      body_measurements_subset: {
        height_cm: 163,
        weight_kg: 55,
        chest_cm: 84.3,
        waist_cm: 67.2,
        hip_cm: 91.8,
        shoulder_width_cm: 38.5,
      },
      mesh_ref: "mock://body_mesh/proto_female_163.npz",
    },
    expected_result: {
      job_id: "smoke-2-female-blouse",
      status: "completed",
      artifacts: {
        depth_png: "/demo_artifacts/samples/smoke2_depth.png",
        normal_png: "/demo_artifacts/samples/smoke2_normal.png",
        fit_signal: {
          collision_count: 0,
          retry_count: 0,
          quality_score: 0.92,
        },
        final_image: "/demo_artifacts/samples/smoke2_final.png",
      },
      provenance: {
        engine_mode: "mock",
        pipeline_version: "v0.1.0",
        body_prototype: "proto_female_163",
        sdf_bank_version: "mock-v0",
        generation_method: "ControlNet+IP-Adapter",
      },
    },
  },
  {
    id: "smoke-3-male-jacket",
    label: "남성 재킷 피팅 (타이트 핏 경고)",
    description: "대형 체형 남성, 슬림핏 재킷 — SDF 충돌 재시도 발생",
    garment_type: "jacket",
    body_request: {
      gender: "male",
      age: 40,
      height_cm: 180,
      weight_kg: 90,
    },
    expected_body: {
      prototype_id: "proto_male_180",
      body_measurements_subset: {
        height_cm: 180,
        weight_kg: 90,
        chest_cm: 105.8,
        waist_cm: 92.4,
        hip_cm: 101.2,
        shoulder_width_cm: 47.5,
      },
      mesh_ref: "mock://body_mesh/proto_male_180.npz",
    },
    expected_result: {
      job_id: "smoke-3-male-jacket",
      status: "completed",
      artifacts: {
        depth_png: "/demo_artifacts/samples/smoke3_depth.png",
        normal_png: "/demo_artifacts/samples/smoke3_normal.png",
        fit_signal: {
          collision_count: 3,
          retry_count: 1,
          quality_score: 0.78,
          warnings: ["tight_fit_shoulder", "sdf_collision_resolved"],
        },
        final_image: "/demo_artifacts/samples/smoke3_final.png",
      },
      provenance: {
        engine_mode: "mock",
        pipeline_version: "v0.1.0",
        body_prototype: "proto_male_180",
        sdf_bank_version: "mock-v0",
        generation_method: "ControlNet+IP-Adapter",
        retry_reason: "SDF collision at shoulder region",
      },
    },
  },
];
