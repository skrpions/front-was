import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthApplication } from './routes/auth/application/auth-application';
import { StorageApplication } from './routes/auth/application/storage-application';
import { AuthInfrastructure } from './routes/auth/infrastructure/auth-infrastructure';
import { StorageInfrastructure } from './routes/auth/infrastructure/storage-infrastructure';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

const application = [
  AuthApplication,
  StorageApplication,
  //ProductApplication,
];
const infrastructure = [
  AuthInfrastructure,
  StorageInfrastructure,
  //ProductInfrastructure,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideToastr(), // Toastr providers
    ...application,
    ...infrastructure,
  ],
};
