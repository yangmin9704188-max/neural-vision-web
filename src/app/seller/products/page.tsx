"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Product {
  garment_id: string;
  name: string;
  category: string;
  material_token: string;
  status: string;
  created_at: string;
  warnings?: Array<{ field: string; level: string; message: string }>;
}

interface SchemaError {
  instancePath: string;
  message?: string;
}

const CATEGORIES = [
  "t-shirt",
  "blouse",
  "jacket",
  "pants",
  "dress",
  "other",
] as const;

const MATERIALS = [
  "cotton_basic",
  "cotton_stretch",
  "polyester",
  "silk",
  "denim",
  "wool",
  "linen",
  "nylon",
  "leather",
  "other",
] as const;

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<SchemaError[]>([]);
  const [warnings, setWarnings] = useState<
    Array<{ field: string; level: string; message: string }>
  >([]);

  const [form, setForm] = useState({
    name: "",
    category: "t-shirt" as string,
    material_token: "cotton_basic" as string,
    front_image: "https://placeholder.example/front.jpg",
    side_image: "",
    back_image: "",
    hero_image: "",
    description: "",
  });

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/seller/products?seller_id=demo-seller");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setValidationErrors([]);
    setWarnings([]);

    const garmentId = `garment_${Date.now()}`;
    const payload = {
      garment_id: garmentId,
      seller_id: "demo-seller",
      name: form.name,
      category: form.category,
      images: {
        front: form.front_image || undefined,
        side: form.side_image || undefined,
        back: form.back_image || undefined,
        hero: form.hero_image || undefined,
      },
      material_token: form.material_token,
      description: form.description || undefined,
    };

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setValidationErrors(data.details);
        }
        if (data.warnings) {
          setWarnings(data.warnings);
        }
        return;
      }

      if (data.warnings) {
        setWarnings(data.warnings);
      }

      setShowForm(false);
      setForm({
        name: "",
        category: "t-shirt",
        material_token: "cotton_basic",
        front_image: "https://placeholder.example/front.jpg",
        side_image: "",
        back_image: "",
        hero_image: "",
        description: "",
      });
      loadProducts();
    } catch {
      setValidationErrors([
        { instancePath: "", message: "네트워크 오류" },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">상품 관리</h1>
          <p className="mt-1 text-gray-600">
            의류 등록 및 Intake Contract(G0) 스키마 검증
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          {showForm ? "취소" : "+ 상품 등록"}
        </button>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">새 상품 등록</h2>
          <p className="mt-1 text-sm text-gray-500">
            Seller Intake Contract (G0) 규격에 맞춰 입력하세요.
          </p>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                스키마 검증 실패
              </p>
              <ul className="mt-2 space-y-1 text-sm text-red-600">
                {validationErrors.map((e, i) => (
                  <li key={i}>
                    {e.instancePath || "root"}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Image warnings */}
          {warnings.length > 0 && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-700">
                이미지 품질 경고
              </p>
              <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                {warnings.map((w, i) => (
                  <li key={i}>
                    <span
                      className={`mr-1 rounded px-1.5 py-0.5 text-xs font-medium ${
                        w.level === "warning"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {w.level}
                    </span>
                    {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                상품명 *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="예: 코튼 베이직 티셔츠"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                카테고리 *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                재질 (material_token) *
              </label>
              <select
                value={form.material_token}
                onChange={(e) =>
                  setForm({ ...form, material_token: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                정면 이미지 URL *
              </label>
              <input
                type="text"
                value={form.front_image}
                onChange={(e) =>
                  setForm({ ...form, front_image: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                측면 이미지 URL
              </label>
              <input
                type="text"
                value={form.side_image}
                onChange={(e) =>
                  setForm({ ...form, side_image: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                후면 이미지 URL
              </label>
              <input
                type="text"
                value={form.back_image}
                onChange={(e) =>
                  setForm({ ...form, back_image: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "검증 중..." : "등록 (스키마 검증 → 엔진 등록)"}
          </button>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-3">
          <div className="grid grid-cols-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>상품명</span>
            <span>카테고리</span>
            <span>재질</span>
            <span>상태</span>
            <span>경고</span>
            <span>등록일</span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            등록된 상품이 없습니다.{" "}
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline"
            >
              첫 상품을 등록하세요
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((p) => (
              <Link
                key={p.garment_id}
                href={`/seller/products`}
                className="grid grid-cols-6 items-center px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{p.name}</span>
                <span>{p.category}</span>
                <span className="text-gray-500">{p.material_token}</span>
                <span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === "ready"
                        ? "bg-green-100 text-green-700"
                        : p.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </span>
                <span>
                  {p.warnings && p.warnings.length > 0 && (
                    <span className="text-xs text-yellow-600">
                      {p.warnings.length}건
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(p.created_at).toLocaleDateString("ko")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
