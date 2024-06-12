import { Injectable } from '@angular/core';
import { Certificate, CertificateEntity } from '../entities/certificate-entity';

@Injectable()
export class CertificateFactory {
  createCertificate(data: Partial<Certificate>): CertificateEntity | null {
    if (!this.isValidCertificateData(data)) {
      console.error('Invalid certificate data', data);
      return null;
    }

    const certificateEntity: CertificateEntity = {
      id: data.id ?? 0,
      titleId: data.titleId ?? 0,
      institution: data.institution ?? '',
      certificationDate: data.certificationDate ?? '',
      certificateType: data.certificateType ?? '',
      userId: data.userId ?? 0,
    };

    return certificateEntity;
  }

  private isValidCertificateData(data: Partial<Certificate>): boolean {
    if (!data) {
      return false; // Validation fails if there's no data
    }

    if (!data.institution || typeof data.institution !== 'string') {
      return false; // Institution must be a non-empty string
    }

    if (!data.certificationDate || typeof data.certificationDate !== 'string') {
      return false; // Certification Date must be a non-empty string
    }

    if (!data.certificateType || typeof data.certificateType !== 'string') {
      return false; // Certificate type must be a non-empty string
    }

    return true; // If all validations pass, the data is valid
  }
}
