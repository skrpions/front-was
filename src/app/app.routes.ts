import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/views/login/login.component';
import { DashboardComponent } from './routes/dashboard/views/dashboard/dashboard.component';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';
import { ListCertificatesComponent } from './routes/certificates/views/list-certificates/list-certificates.component';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { ListCollaboratorsComponent } from './routes/collaborators/views/list-collaborators/list-collaborators.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard', // (Private) 🚷 Dashboard ...
    component: AdminLayoutComponent,
    canActivate: [loggedInGuard],
    children: [
      {
        path: 'home',
        component: ListCertificatesComponent,
      },
      {
        path: 'collaborators',
        component: ListCollaboratorsComponent,
      },
      /* {
        path: 'home',
        component: DashboardComponent,
      },
      {
        path: 'certificates',
        component: ListCertificatesComponent,
      }, */
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
