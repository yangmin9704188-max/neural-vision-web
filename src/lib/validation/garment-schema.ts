/**
 * Garment Intake Schema (Ajv)
 *
 * Seller Intake Contract (G0) 기반:
 *   - 판매자 업로드 이미지(정면 필수, 측면/후면/히어로 선택)
 *   - 재질 정보(material_token)
 *
 * PIPELINE_MAP: "Fabric Swatch & Texture DNA Processing.
 *   스와치 이미지의 품질을 진단하고 이물질(단추, 라벨 등)을 탐지"
 */

import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export const garmentIntakeSchema = {
  type: "object",
  properties: {
    garment_id: { type: "string", minLength: 1 },
    seller_id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1, maxLength: 200 },
    category: {
      type: "string",
      enum: ["t-shirt", "blouse", "jacket", "pants", "dress", "other"],
    },
    images: {
      type: "object",
      properties: {
        front: { type: "string", minLength: 1 },
        side: { type: "string" },
        back: { type: "string" },
        hero: { type: "string" },
      },
      required: ["front"],
    },
    material_token: {
      type: "string",
      enum: [
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
      ],
    },
    size_range: {
      type: "object",
      properties: {
        min: { type: "string" },
        max: { type: "string" },
      },
    },
    description: { type: "string", maxLength: 1000 },
  },
  required: ["garment_id", "seller_id", "name", "category", "images", "material_token"],
  additionalProperties: false,
};

export const validateGarmentIntake = ajv.compile(garmentIntakeSchema);

/**
 * 이미지 품질 경고 생성 (mock)
 * PIPELINE_MAP: "이물질(단추, 라벨 등)을 탐지하여 타일링 가능한 텍스처 임베딩을 추출"
 */
export interface ImageWarning {
  field: string;
  level: "info" | "warning" | "error";
  message: string;
}

export function checkImageWarnings(images: {
  front?: string;
  side?: string;
  back?: string;
  hero?: string;
}): ImageWarning[] {
  const warnings: ImageWarning[] = [];

  if (!images.front) {
    warnings.push({
      field: "images.front",
      level: "error",
      message: "정면 이미지는 필수입니다.",
    });
  }

  if (!images.side) {
    warnings.push({
      field: "images.side",
      level: "warning",
      message: "측면 이미지가 없으면 프록시 메쉬 정밀도가 낮아집니다.",
    });
  }

  if (!images.back) {
    warnings.push({
      field: "images.back",
      level: "info",
      message: "후면 이미지 권장 — 텍스처 DNA 완성도 향상.",
    });
  }

  if (!images.hero) {
    warnings.push({
      field: "images.hero",
      level: "info",
      message: "히어로 이미지 권장 — 쇼케이스 표시에 사용됩니다.",
    });
  }

  return warnings;
}
