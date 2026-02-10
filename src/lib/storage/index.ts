/**
 * Persistence abstraction (dev: fs/json).
 *
 * TODO (PR-B): Implement file-based storage for sellers/jobs
 * TODO (PR-D): Switch to real storage backend
 */

export interface StorageAdapter {
  read<T>(collection: string, id: string): Promise<T | null>;
  write<T>(collection: string, id: string, data: T): Promise<void>;
  list<T>(collection: string): Promise<T[]>;
  delete(collection: string, id: string): Promise<void>;
}

/**
 * Placeholder — will be implemented in PR-B.
 */
export function getStorage(): StorageAdapter {
  throw new Error("StorageAdapter not implemented yet. See PR-B.");
}
