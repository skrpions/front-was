export interface Certificate {
  id: number;
  title: string;
  institution: string;
  certificationDate: string;
  certificateType: string;
}

export type CertificateEntity = Required<Certificate>;
