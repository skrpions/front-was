export interface Certificate {
  id: number;
  title: string;
  institution: string;
  certificationDate: string;
  certificateType: string;
  userId: number;
}

export type CertificateEntity = Required<Certificate>;
