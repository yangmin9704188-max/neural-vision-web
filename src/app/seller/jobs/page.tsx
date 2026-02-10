"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface JobData {
  job_id: string;
  garment_id: string;
  status: string;
  created_at: string;
  result?: {
    artifacts?: {
      final_image?: string;
      fit_signal?: {
        quality_score?: number;
        warnings?: string[];
      };
    };
  };
}

interface ProductData {
  garment_id: string;
  name: string;
}

type Gender = "male" | "female";

export default function SellerJobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const [form, setForm] = useState({
    garment_id: "",
    gender: "male" as Gender,
    age: 28,
    height_cm: 175,
    weight_kg: 70,
  });

  const loadData = useCallback(async () => {
    try {
      const [jobsRes, prodsRes] = await Promise.all([
        fetch("/api/seller/jobs?seller_id=demo-seller"),
        fetch("/api/seller/products?seller_id=demo-seller"),
      ]);
      const jobsData = await jobsRes.json();
      const prodsData = await prodsRes.json();
      setJobs(jobsData.jobs ?? []);
      setProducts(prodsData.products ?? []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async () => {
    if (!form.garment_id) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/seller/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: "demo-seller",
          garment_id: form.garment_id,
          body_request: {
            gender: form.gender,
            age: form.age,
            height_cm: form.height_cm,
            weight_kg: form.weight_kg,
          },
        }),
      });

      if (res.ok) {
        setSubmitResult("Job 제출 완료!");
        setShowForm(false);
        loadData();
      } else {
        const data = await res.json();
        setSubmitResult(`실패: ${data.error}`);
      }
    } catch {
      setSubmitResult("네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">피팅 Job 관리</h1>
          <p className="mt-1 text-gray-600">
            가상 피팅 Job 제출, 진행 상태 추적, 결과 아티팩트 확인
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          {showForm ? "취소" : "+ Job 제출"}
        </button>
      </div>

      {submitResult && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            submitResult.startsWith("실패")
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {submitResult}
        </div>
      )}

      {/* Job 제출 폼 */}
      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">새 피팅 Job</h2>
          <p className="mt-1 text-sm text-gray-500">
            등록된 상품을 선택하고 신체 정보를 입력하세요.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                상품 선택 *
              </label>
              {products.length === 0 ? (
                <p className="mt-1 text-sm text-gray-400">
                  등록된 상품이 없습니다.{" "}
                  <Link
                    href="/seller/products"
                    className="text-blue-600 hover:underline"
                  >
                    먼저 상품을 등록하세요
                  </Link>
                </p>
              ) : (
                <select
                  value={form.garment_id}
                  onChange={(e) =>
                    setForm({ ...form, garment_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">-- 선택 --</option>
                  {products.map((p) => (
                    <option key={p.garment_id} value={p.garment_id}>
                      {p.name} ({p.garment_id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="mt-1 flex gap-2">
                {(["male", "female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      form.gender === g
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !form.garment_id}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting
              ? "파이프라인 실행 중..."
              : "Job 제출 (Body → Fitting → Generation)"}
          </button>
        </div>
      )}

      {/* Job 목록 */}
      <div className="mt-8 space-y-4">
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-400">
            제출된 Job이 없습니다.
          </div>
        ) : (
          jobs.map((job) => {
            const quality = job.result?.artifacts?.fit_signal?.quality_score;
            const warnings = job.result?.artifacts?.fit_signal?.warnings;

            return (
              <div
                key={job.job_id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {job.job_id}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      상품: {job.garment_id} | 생성:{" "}
                      {new Date(job.created_at).toLocaleString("ko")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      job.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : job.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : job.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* 아티팩트 렌더링 */}
                {job.result?.artifacts && (
                  <div className="border-t border-gray-100 px-6 py-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      아티팩트 (Fitting + Generation)
                    </h3>

                    {quality !== undefined && (
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-gray-500">품질:</span>
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              quality >= 0.9
                                ? "bg-green-500"
                                : quality >= 0.8
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${quality * 100}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            quality >= 0.9
                              ? "text-green-600"
                              : quality >= 0.8
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {(quality * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    {warnings && warnings.length > 0 && (
                      <div className="mt-2 rounded bg-yellow-50 p-2 text-xs text-yellow-700">
                        경고: {warnings.join(", ")}
                      </div>
                    )}

                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {job.result.artifacts.final_image && (
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <div className="text-2xl">👔</div>
                          <p className="mt-1 text-xs font-medium text-blue-600">
                            최종 결과
                          </p>
                          <p className="text-[10px] text-gray-400">
                            final_layer_result.png
                          </p>
                        </div>
                      )}
                      {Object.entries(job.result.artifacts)
                        .filter(
                          ([k, v]) =>
                            v &&
                            typeof v === "string" &&
                            k !== "final_image" &&
                            k !== "fit_signal"
                        )
                        .map(([key]) => (
                          <div
                            key={key}
                            className="rounded-lg bg-gray-100 p-3 text-center"
                          >
                            <div className="text-2xl text-gray-400">🗺️</div>
                            <p className="mt-1 text-xs text-gray-500">{key}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
