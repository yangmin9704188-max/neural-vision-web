/**
 * Engine module barrel export.
 *
 * Usage:
 *   import { getEngine } from "@/lib/engine";
 *   const engine = getEngine();
 *   const result = await engine.ping();
 *
 * ENV 전환:
 *   NEXT_PUBLIC_ENGINE_MODE=mock  → MockEngineClient (기본값)
 *   NEXT_PUBLIC_ENGINE_MODE=real  → RealEngineClient (ENGINE_API_BASE_URL 필수)
 */

export type { EngineClient } from "./client";
export { MockEngineClient } from "./mock";
export { RealEngineClient } from "./real";
export * from "./types";

import type { EngineClient } from "./client";
import { MockEngineClient } from "./mock";
import { RealEngineClient } from "./real";

let _instance: EngineClient | null = null;

/**
 * 현재 엔진 모드를 반환합니다.
 */
export function getEngineMode(): "mock" | "real" {
  return (process.env.NEXT_PUBLIC_ENGINE_MODE ?? "mock") as "mock" | "real";
}

/**
 * Returns the singleton EngineClient instance.
 * mock ↔ real 전환은 NEXT_PUBLIC_ENGINE_MODE 환경변수로 제어합니다.
 * UI 코드 변경 없이 전환됩니다.
 */
export function getEngine(): EngineClient {
  if (!_instance) {
    const mode = getEngineMode();

    if (mode === "real") {
      _instance = new RealEngineClient();
    } else {
      _instance = new MockEngineClient();
    }
  }

  return _instance;
}
