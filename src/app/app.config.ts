import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthApplication } from './routes/auth/application/auth-application';
import { StorageApplication } from './routes/auth/application/storage-application';
import { AuthInfrastructure } from './routes/auth/infrastructure/auth-infrastructure';
import { StorageInfrastructure } from './routes/auth/infrastructure/storage-infrastructure';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CertificateApplication } from './routes/certificates/application/certificate-application';
import { CertificateInfrastructure } from './routes/certificates/infrastructure/certificate-infrastructure';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

const application = [
  AuthApplication,
  StorageApplication,
  CertificateApplication,
];
const infrastructure = [
  AuthInfrastructure,
  StorageInfrastructure,
  CertificateInfrastructure,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])), // HttpClient
    provideToastr(), // Toastr providers
    ...application,
    ...infrastructure,
  ],
};
