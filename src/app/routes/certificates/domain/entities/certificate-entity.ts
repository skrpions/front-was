export interface Certificate {
  id: number;
  titleId: number;
  institution: string;
  certificationDate: string;
  certificateType: string;
  userId: number;
}

export type CertificateEntity = Required<Certificate>;
