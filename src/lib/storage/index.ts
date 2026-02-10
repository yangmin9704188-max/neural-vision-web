/**
 * In-memory Storage Adapter (dev/mock 환경)
 *
 * storage/ 디렉토리(gitignored)를 사용하는 대신,
 * 개발 환경에서는 in-memory map을 사용합니다.
 *
 * TODO (PR-D): 실제 파일 기반 or 외부 스토리지로 교체
 */

export interface StorageAdapter {
  read<T>(collection: string, id: string): Promise<T | null>;
  write<T>(collection: string, id: string, data: T): Promise<void>;
  list<T>(collection: string): Promise<T[]>;
  delete(collection: string, id: string): Promise<boolean>;
}

class InMemoryStorage implements StorageAdapter {
  private store = new Map<string, Map<string, unknown>>();

  private getCollection(name: string): Map<string, unknown> {
    if (!this.store.has(name)) {
      this.store.set(name, new Map());
    }
    return this.store.get(name)!;
  }

  async read<T>(collection: string, id: string): Promise<T | null> {
    const col = this.getCollection(collection);
    return (col.get(id) as T) ?? null;
  }

  async write<T>(collection: string, id: string, data: T): Promise<void> {
    const col = this.getCollection(collection);
    col.set(id, data);
  }

  async list<T>(collection: string): Promise<T[]> {
    const col = this.getCollection(collection);
    return Array.from(col.values()) as T[];
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const col = this.getCollection(collection);
    return col.delete(id);
  }
}

let _storage: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!_storage) {
    _storage = new InMemoryStorage();
  }
  return _storage;
}
