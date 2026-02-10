"use client";

import { useState } from "react";
import { SMOKE_SCENARIOS } from "@/lib/engine/smoke-scenarios";

type Gender = "male" | "female";

interface BodyForm {
  gender: Gender;
  age: number;
  height_cm: number;
  weight_kg: number;
}

interface BodyResultData {
  prototype_id: string;
  body_measurements_subset: Record<string, number>;
  mesh_ref?: string;
}

interface FitSignalData {
  collision_count?: number;
  retry_count?: number;
  quality_score?: number;
  warnings?: string[];
}

interface JobResultData {
  job_id: string;
  status: string;
  result?: {
    job_id: string;
    status: string;
    artifacts?: {
      depth_png?: string;
      normal_png?: string;
      fit_signal?: FitSignalData;
      final_image?: string;
    };
    provenance?: Record<string, unknown>;
  };
}

const DEFAULT_GARMENT = {
  garment_id: "demo-garment-001",
  seller_id: "demo-seller",
  images: { front: "/demo_artifacts/samples/garment_front.png" },
  material_token: "cotton_basic",
};

export default function DemoPage() {
  const [form, setForm] = useState<BodyForm>({
    gender: "male",
    age: 28,
    height_cm: 175,
    weight_kg: 70,
  });
  const [loading, setLoading] = useState(false);
  const [bodyResult, setBodyResult] = useState<BodyResultData | null>(null);
  const [jobResult, setJobResult] = useState<JobResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScenario = (idx: number) => {
    const s = SMOKE_SCENARIOS[idx];
    setForm(s.body_request);
    setBodyResult(null);
    setJobResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setBodyResult(null);
    setJobResult(null);

    try {
      // Step 1: Body Module
      const bodyRes = await fetch("/api/engine/body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body: BodyResultData = await bodyRes.json();
      setBodyResult(body);

      // Step 2: Garment 등록 (데모용 기본 의류)
      const garmentRes = await fetch("/api/engine/garment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_GARMENT),
      });
      const garment = await garmentRes.json();

      // Step 3: Fitting + Generation
      const jobRes = await fetch("/api/engine/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          garment,
        }),
      });
      const job: JobResultData = await jobRes.json();
      setJobResult(job);
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const fitSignal = jobResult?.result?.artifacts?.fit_signal as FitSignalData | undefined;
  const qualityScore = fitSignal?.quality_score;
  const warnings = fitSignal?.warnings;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Virtual Fitting Demo</h1>
      <p className="mt-2 text-gray-600">
        신체 정보를 입력하고 가상 피팅 파이프라인을 실행해 보세요.
        <span className="ml-2 text-xs text-gray-400">
          Body → Garment → Fitting(SDF) → Generation(ControlNet+IP-Adapter)
        </span>
      </p>

      {/* Smoke 시나리오 프리셋 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SMOKE_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleScenario(i)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* ── 입력 패널 ── */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Body Parameters</h2>
          <p className="mt-1 text-sm text-gray-500">
            Online Body Module 입력값 (성별, 나이, 키, 몸무게)
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="mt-1 flex gap-3">
                {(["male", "female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      form.gender === g
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {g === "male" ? "남성" : "여성"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                나이
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                키 (cm)
              </label>
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) =>
                  setForm({ ...form, height_cm: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                몸무게 (kg)
              </label>
              <input
                type="number"
                value={form.weight_kg}
                onChange={(e) =>
                  setForm({ ...form, weight_kg: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "파이프라인 실행 중..." : "가상 피팅 실행"}
            </button>
          </div>
        </section>

        {/* ── 결과 패널 ── */}
        <section className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Body Result */}
          {bodyResult && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Body Module 결과</h2>
              <p className="mt-1 text-xs text-gray-400">
                Prototype: {bodyResult.prototype_id}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(bodyResult.body_measurements_subset).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="text-gray-600">{key}</span>
                      <span className="font-mono font-medium">
                        {typeof val === "number" ? val.toFixed(1) : String(val)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Fitting + Generation Result */}
          {jobResult?.result && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Fitting Result</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    jobResult.result.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {jobResult.result.status}
                </span>
              </div>

              {/* Quality Score */}
              {qualityScore !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">품질 점수</span>
                    <span
                      className={`font-mono font-bold ${
                        qualityScore >= 0.9
                          ? "text-green-600"
                          : qualityScore >= 0.8
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {(qualityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        qualityScore >= 0.9
                          ? "bg-green-500"
                          : qualityScore >= 0.8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${qualityScore * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Warnings */}
              {warnings && warnings.length > 0 && (
                <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-xs font-semibold text-yellow-800">
                    SDF Collision 경고
                  </p>
                  <ul className="mt-1 space-y-1">
                    {warnings.map((w, i) => (
                      <li
                        key={i}
                        className="text-xs text-yellow-700"
                      >
                        - {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Artifacts */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">
                  아티팩트 (Generation Module)
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {jobResult.result.artifacts?.depth_png && (
                    <div className="rounded-lg bg-gray-100 p-3 text-center">
                      <div className="flex h-20 items-center justify-center text-2xl text-gray-400">
                        🗺️
                      </div>
                      <p className="mt-1 text-xs text-gray-500">depth.png</p>
                    </div>
                  )}
                  {jobResult.result.artifacts?.normal_png && (
                    <div className="rounded-lg bg-gray-100 p-3 text-center">
                      <div className="flex h-20 items-center justify-center text-2xl text-gray-400">
                        🗺️
                      </div>
                      <p className="mt-1 text-xs text-gray-500">normal.png</p>
                    </div>
                  )}
                  {jobResult.result.artifacts?.final_image && (
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <div className="flex h-20 items-center justify-center text-2xl text-blue-400">
                        👔
                      </div>
                      <p className="mt-1 text-xs font-medium text-blue-600">
                        final_result.png
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Provenance */}
              {jobResult.result.provenance && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                    provenance.json 상세보기
                  </summary>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                    {JSON.stringify(jobResult.result.provenance, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* 미실행 상태 */}
          {!bodyResult && !error && (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-gray-400">
              왼쪽에서 신체 정보를 입력하고 실행해 주세요
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
