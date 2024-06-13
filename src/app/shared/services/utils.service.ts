import { jwtDecode } from 'jwt-decode';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenResponse } from '../../routes/auth/domain/entities/token-entity';
import { StorageApplication } from '../../routes/auth/application/storage-application';

export interface TokenEntity {
  id: number;
  username: string;
  name: string;
  lastname: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private user!: TokenResponse;
  private toastr = inject(ToastrService);
  private readonly storageApplication = inject(StorageApplication);

  constructor() {
    const rawUser = this.storageApplication.getField('user');
    this.user = rawUser ? JSON.parse(rawUser) : null;
  }

  setUser(user: TokenResponse) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  decodeTokenAndSetUser(token: string) {
    if (!token) {
      throw new Error('Token not found');
    }

    const decodedToken: TokenResponse = jwtDecode(token);
    this.storageApplication.setField('user', JSON.stringify(decodedToken));
  }

  handleSuccess(action: string) {
    this.toastr.success(action, 'Ok!');
  }

  handleError(action: string) {
    this.toastr.error(action, 'Opss!');
  }
}
