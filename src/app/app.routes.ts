import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/views/login/login.component';
import { DashboardComponent } from './routes/dashboard/views/dashboard/dashboard.component';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';

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
    //canActivate: [loggedInGuard],
    children: [
      {
        path: 'home',
        component: DashboardComponent,
      },
      /*       {
        path: 'products',
        component: ListProductsComponent
      },
      {
        path: 'categories',
        component: ListCategoriesComponent
      } */
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
