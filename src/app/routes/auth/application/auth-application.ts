import { Inject, inject, Injectable } from '@angular/core';
import { AuthInfrastructure } from '../infrastructure/auth-infrastructure';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { Router } from '@angular/router';
import { TokenEntity } from '../domain/entities/token-entity';
import { StorageInfrastructure } from '../infrastructure/storage-infrastructure';
import { StorageRepository } from '../domain/repositories/storage-repository';
import { UtilsService } from '../../../shared/services/utils.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthApplication {
  private userLogged = false;

  private router = inject(Router);
  private utilSrv = inject(UtilsService);

  constructor(
    @Inject(AuthInfrastructure) private readonly authRepository: AuthRepository,
    @Inject(StorageInfrastructure)
    private readonly storageRepository: StorageRepository
  ) {}

  login(auth: any) {
    this.authRepository.login(auth).subscribe({
      next: this.userAuthenticated.bind(this),
      error: (error) => this.handleError(error),
    });
  }

  private userAuthenticated(response: TokenEntity) {
    this.storageRepository.setStorage('token', response.token);
    this.utilSrv.decodeTokenAndSetUser(response.token);
    this.userLogged = true;

    this.router.navigateByUrl('/dashboard/home');
  }

  private handleError(error: any) {
    if (error.status === 0) {
      // Si el error.status es 0, probablemente es un problema de conectividad con el servidor.
      this.utilSrv.handleError('Server is down. Please try again later.');
    } else {
      // Manejar error de autenticación (credenciales incorrectas)
      this.utilSrv.handleError('Incorrect Document Number!');
      //this.utilSrv.handleError('Incorrect username or password!');
    }
  }

  get isUserLogged(): boolean {
    const accessToken = this.storageRepository.getStorage('token');

    return !!accessToken || this.userLogged;
  }
}
