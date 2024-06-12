import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificateEntity } from '../domain/entities/certificate-entity';
import { environment } from '../../../../environments/environment.development';

@Injectable()
export class CertificateInfrastructure {
  constructor(private http: HttpClient) {}

  list(): Observable<CertificateEntity[]> {
    return this.http.get<CertificateEntity[]>(
      `${environment.apiPath}api/certificates`
      //`${environment.apiPath}/certificates`
    );
  }

  listCertificatesById(id: string): Observable<CertificateEntity> {
    return this.http.get<CertificateEntity>(
      `${environment.apiPath}api/certificates/user/${id}`
    );
  }

  add(entity: Partial<CertificateEntity>): Observable<CertificateEntity> {
    return this.http.post<CertificateEntity>(
      `${environment.apiPath}api/certificates`,
      entity
    );
  }

  update(id: string, entity: CertificateEntity): Observable<CertificateEntity> {
    return this.http.put<CertificateEntity>(
      `${environment.apiPath}api/certificates/${id}`,
      entity
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiPath}api/certificates/${id}`
    );
  }
}
