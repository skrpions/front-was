import { Inject, Injectable } from '@angular/core';
import { StorageInfrastructure } from '../infrastructure/storage-infrastructure';
import { StorageRepository } from '../domain/repositories/storage-repository';

@Injectable()
export class StorageApplication {
  constructor(
    @Inject(StorageInfrastructure)
    private readonly storageRepository: StorageRepository
  ) {}

  setField(propertyName: string, value: any): void {
    this.storageRepository.setStorage(propertyName, value);
  }

  getField(propertyName: string): string | null {
    return this.storageRepository.getStorage(propertyName);
  }

  clear(): void {
    this.storageRepository.clear();
  }
}
