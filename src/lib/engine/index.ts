/**
 * Engine module barrel export.
 *
 * Usage:
 *   import { getEngine } from "@/lib/engine";
 *   const engine = getEngine();
 *   const result = await engine.ping();
 */

export type { EngineClient } from "./client";
export { MockEngineClient } from "./mock";
export * from "./types";

import type { EngineClient } from "./client";
import { MockEngineClient } from "./mock";

let _instance: EngineClient | null = null;

/**
 * Returns the singleton EngineClient instance.
 * Switches between mock and real based on NEXT_PUBLIC_ENGINE_MODE env var.
 *
 * Default: "mock" (until PR-D introduces the real adapter).
 */
export function getEngine(): EngineClient {
  if (!_instance) {
    const mode = process.env.NEXT_PUBLIC_ENGINE_MODE ?? "mock";

    if (mode === "real") {
      // TODO (PR-D): import and instantiate RealEngineClient
      throw new Error(
        "RealEngineClient is not implemented yet. Set NEXT_PUBLIC_ENGINE_MODE=mock or wait for PR-D."
      );
    }

    _instance = new MockEngineClient();
  }

  return _instance;
}
