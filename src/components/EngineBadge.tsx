"use client";

import { useEffect, useState } from "react";

interface PingResult {
  ok: boolean;
  mode: "mock" | "real";
}

/**
 * 엔진 모드 배지 — 헤더에 현재 mock/real 상태를 표시합니다.
 * /api/engine/ping을 호출하여 실제 연결 상태를 확인합니다.
 */
export default function EngineBadge() {
  const [status, setStatus] = useState<PingResult | null>(null);

  useEffect(() => {
    fetch("/api/engine/ping")
      .then((r) => r.json())
      .then((data: PingResult) => setStatus(data))
      .catch(() => setStatus({ ok: false, mode: "mock" }));
  }, []);

  if (!status) return null;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        status.mode === "real"
          ? status.ok
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          : "bg-purple-100 text-purple-700"
      }`}
      title={`Engine: ${status.mode} | Connected: ${status.ok}`}
    >
      {status.mode === "real" ? (status.ok ? "REAL" : "REAL (offline)") : "MOCK"}
    </span>
  );
}
