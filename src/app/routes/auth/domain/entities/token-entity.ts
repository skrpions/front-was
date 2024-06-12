export interface TokenEntity {
  token: string;
  //expirationDate: string;
}

export interface TokenResponse {
  id: number;
  username: string;
  name: string;
  lastname: string;
  iat: number;
  exp: number;
}
