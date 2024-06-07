export interface Certificate {
  id: number;
  title: string;
  institution: string;
  graduationDate: string;
  certificateType: string;
}

export type CertificateEntity = Required<Certificate>;
