export interface Certificate {
  id: number;
  titleId: number;
  institution: string;
  certificationDate: string;
  certificateType: string;
  userId: number;
  professionalCardIssueDate: string;
}

export type CertificateEntity = Required<Certificate>;
