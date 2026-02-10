"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ArtifactData {
  depth_png?: string;
  normal_png?: string;
  fit_signal?: {
    collision_count?: number;
    retry_count?: number;
    quality_score?: number;
    warnings?: string[];
  };
  final_image?: string;
}

interface JobDetail {
  job_id: string;
  seller_id: string;
  garment_id: string;
  body_request: {
    gender: string;
    age: number;
    height_cm: number;
    weight_kg: number;
  };
  status: string;
  created_at: string;
  updated_at: string;
  result?: {
    job_id: string;
    status: string;
    artifacts?: ArtifactData;
    provenance?: Record<string, unknown>;
  };
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/engine/job/${jobId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Job not found");
        return r.json();
      })
      .then(setJob)
      .catch((e) => setError(e.message));
  }, [jobId]);

  if (error) {
    return (
      <div className="px-8 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
        <Link
          href="/seller/jobs"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Job 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-8 py-8 text-gray-400">로딩 중...</div>
    );
  }

  const artifacts = job.result?.artifacts;
  const fitSignal = artifacts?.fit_signal;

  return (
    <div className="px-8 py-8">
      <Link
        href="/seller/jobs"
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; Job 목록
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono">{job.job_id}</h1>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            job.status === "completed"
              ? "bg-green-100 text-green-700"
              : job.status === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* 기본 정보 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Body Request</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">성별</span>
              <span>{job.body_request.gender === "male" ? "남성" : "여성"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">나이</span>
              <span>{job.body_request.age}세</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">키</span>
              <span>{job.body_request.height_cm}cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">몸무게</span>
              <span>{job.body_request.weight_kg}kg</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Fitting Signal</h2>
          {fitSignal ? (
            <div className="mt-3 space-y-3">
              {fitSignal.quality_score !== undefined && (
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">품질 점수</span>
                    <span className="font-bold">
                      {(fitSignal.quality_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        fitSignal.quality_score >= 0.9
                          ? "bg-green-500"
                          : fitSignal.quality_score >= 0.8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${fitSignal.quality_score * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SDF 충돌 횟수</span>
                <span>{fitSignal.collision_count ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">재시도 횟수</span>
                <span>{fitSignal.retry_count ?? 0}</span>
              </div>
              {fitSignal.warnings && fitSignal.warnings.length > 0 && (
                <div className="rounded bg-yellow-50 p-3 text-xs text-yellow-700">
                  <p className="font-semibold">경고:</p>
                  <ul className="mt-1 space-y-0.5">
                    {fitSignal.warnings.map((w, i) => (
                      <li key={i}>- {w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-400">결과 대기 중</p>
          )}
        </div>
      </div>

      {/* 아티팩트 */}
      {artifacts && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            아티팩트 (Generation Module 출력)
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            depth.png, normal.png → Fitting Module | final_layer_result.png →
            Generation Module
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {artifacts.depth_png && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <div className="flex h-32 items-center justify-center text-4xl text-gray-300">
                  🗺️
                </div>
                <p className="mt-2 text-sm font-medium">Depth Map</p>
                <p className="text-xs text-gray-400">depth.png</p>
                <p className="mt-1 truncate text-[10px] text-gray-300">
                  {artifacts.depth_png}
                </p>
              </div>
            )}

            {artifacts.normal_png && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <div className="flex h-32 items-center justify-center text-4xl text-gray-300">
                  🗺️
                </div>
                <p className="mt-2 text-sm font-medium">Normal Map</p>
                <p className="text-xs text-gray-400">normal.png</p>
                <p className="mt-1 truncate text-[10px] text-gray-300">
                  {artifacts.normal_png}
                </p>
              </div>
            )}

            {artifacts.final_image && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                <div className="flex h-32 items-center justify-center text-4xl text-blue-400">
                  👔
                </div>
                <p className="mt-2 text-sm font-medium text-blue-700">
                  최종 피팅 결과
                </p>
                <p className="text-xs text-blue-400">
                  final_layer_result.png
                </p>
                <p className="mt-1 truncate text-[10px] text-blue-300">
                  {artifacts.final_image}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Provenance */}
      {job.result?.provenance && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
            provenance.json / gen_provenance.json 상세
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600">
            {JSON.stringify(job.result.provenance, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
