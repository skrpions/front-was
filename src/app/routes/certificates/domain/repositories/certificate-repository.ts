import { Observable } from 'rxjs';
import { CertificateEntity } from '../entities/certificate-entity';

export interface CertificateRepository {
  list(): Observable<CertificateEntity[]>;
  listCertificatesById(id: number): Observable<CertificateEntity[]>;
  add(
    certificateEntity: Partial<CertificateEntity>
  ): Observable<CertificateEntity>;
  update(
    id: number,
    certificateEntity: Partial<CertificateEntity>
  ): Observable<CertificateEntity>;
  delete(id: number): Observable<CertificateEntity>;
}
