import { Injectable } from '@angular/core';
import { StorageRepository } from '../domain/repositories/storage-repository';

@Injectable()
export class StorageInfrastructure implements StorageRepository {
  setStorage(propertyName: string, value: string): void {
    localStorage.setItem(propertyName, value);
  }
  getStorage(propertyName: string): string | null {
    return localStorage.getItem(propertyName);
  }
  clear(): void {
    localStorage.clear();
  }
}
