export interface StorageRepository {
  setStorage(propertyName: string, value: string): void;
  getStorage(propertyName: string): string | null;
  clear(): void;
}
