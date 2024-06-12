import { Observable } from 'rxjs';
import { CertificateRepository } from '../domain/repositories/certificate-repository';
import { CertificateEntity } from '../domain/entities/certificate-entity';
import { Inject, Injectable } from '@angular/core';
import { CertificateInfrastructure } from '../infrastructure/certificate-infrastructure';
import { TitleEntity } from '../domain/entities/title-entity';

@Injectable()
export class CertificateApplication {
  constructor(
    @Inject(CertificateInfrastructure)
    private readonly certificateRepository: CertificateRepository
  ) {}

  list(): Observable<CertificateEntity[]> {
    return this.certificateRepository.list();
  }

  listCertificatesById(id: number): Observable<CertificateEntity[]> {
    return this.certificateRepository.listCertificatesById(id);
  }

  add(
    certificateEntity: Partial<CertificateEntity>
  ): Observable<CertificateEntity> {
    return this.certificateRepository.add(certificateEntity);
  }

  update(
    id: number,
    entity: Partial<CertificateEntity>
  ): Observable<CertificateEntity> {
    return this.certificateRepository.update(id, entity);
  }

  delete(id: number): Observable<CertificateEntity> {
    return this.certificateRepository.delete(id);
  }

  listTitles(): Observable<TitleEntity[]> {
    return this.certificateRepository.listTitles();
  }
}
