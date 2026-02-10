"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  products: number;
  activeJobs: number;
  completed: number;
}

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    activeJobs: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, jobsRes] = await Promise.all([
          fetch("/api/seller/products?seller_id=demo-seller"),
          fetch("/api/engine/jobs?seller_id=mock-seller"),
        ]);
        const prodData = await prodRes.json();
        const jobsData = await jobsRes.json();

        setStats({
          products: prodData.count ?? 0,
          activeJobs:
            jobsData.jobs?.filter(
              (j: { status: string }) =>
                j.status === "pending" || j.status === "processing"
            ).length ?? 0,
          completed:
            jobsData.jobs?.filter(
              (j: { status: string }) => j.status === "completed"
            ).length ?? 0,
        });
      } catch {
        // 초기 상태 유지
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "등록 상품", value: stats.products, color: "text-blue-600" },
    { label: "진행 중 Job", value: stats.activeJobs, color: "text-yellow-600" },
    { label: "완료된 Job", value: stats.completed, color: "text-green-600" },
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">판매자 계정 요약 및 주요 지표</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`mt-1 text-3xl font-bold ${card.color}`}>
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">시작하기</h2>
        <ol className="mt-4 space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              1
            </span>
            <span>
              <strong>상품 등록</strong> — 의류 이미지(정면 필수)와 재질 정보를
              등록합니다.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              2
            </span>
            <span>
              <strong>스키마 검증</strong> — Ajv가 Intake Contract(G0) 규격을
              자동 검증합니다.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              3
            </span>
            <span>
              <strong>피팅 Job 제출</strong> — 등록된 상품으로 가상 피팅을
              요청합니다.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
