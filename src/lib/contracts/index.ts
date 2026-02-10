/**
 * Contracts module — generated types, schema loaders, helpers.
 *
 * TODO (PR-A): Auto-generate TypeScript types from JSON schemas
 * TODO (PR-A): Schema loader for runtime validation
 */

import contractsLock from "../../../contracts.lock.json";

export interface ContractsManifest {
  repo: string;
  tag: string;
  commit: string;
  pinned_at: string;
}

/**
 * Returns the currently pinned contracts manifest.
 */
export function getContractsManifest(): ContractsManifest {
  return {
    repo: contractsLock.repo,
    tag: contractsLock.tag,
    commit: contractsLock.commit,
    pinned_at: contractsLock.pinned_at,
  };
}
