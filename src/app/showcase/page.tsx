import { SMOKE_SCENARIOS } from "@/lib/engine/smoke-scenarios";

export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Showcase</h1>
      <p className="mt-2 text-gray-600">
        Smoke Test 3종 시나리오의 사전 생성 결과를 확인하세요.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SMOKE_SCENARIOS.map((scenario) => {
          const fitSignal = scenario.expected_result.artifacts?.fit_signal as
            | Record<string, unknown>
            | undefined;
          const quality =
            typeof fitSignal?.quality_score === "number"
              ? fitSignal.quality_score
              : null;
          const warnings = Array.isArray(fitSignal?.warnings)
            ? (fitSignal.warnings as string[])
            : [];

          return (
            <div
              key={scenario.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              {/* 이미지 영역 (mock placeholder) */}
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <span className="text-4xl">
                  {scenario.garment_type === "t-shirt"
                    ? "👕"
                    : scenario.garment_type === "blouse"
                      ? "👚"
                      : "🧥"}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold">{scenario.label}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {scenario.description}
                </p>

                {/* 신체 파라미터 */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-gray-100 px-2 py-1">
                    {scenario.body_request.gender === "male" ? "남성" : "여성"}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1">
                    {scenario.body_request.height_cm}cm
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1">
                    {scenario.body_request.weight_kg}kg
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1">
                    {scenario.body_request.age}세
                  </span>
                </div>

                {/* 품질 점수 */}
                {quality !== null && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">품질 점수</span>
                      <span
                        className={`font-mono font-bold ${
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
                    <div className="mt-1 h-1.5 rounded-full bg-gray-200">
                      <div
                        className={`h-1.5 rounded-full ${
                          quality >= 0.9
                            ? "bg-green-500"
                            : quality >= 0.8
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${quality * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 경고 */}
                {warnings.length > 0 && (
                  <div className="mt-2 rounded bg-yellow-50 p-2 text-xs text-yellow-700">
                    {warnings.join(", ")}
                  </div>
                )}

                {/* Prototype */}
                <p className="mt-3 text-xs text-gray-400">
                  Prototype: {scenario.expected_body.prototype_id}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
