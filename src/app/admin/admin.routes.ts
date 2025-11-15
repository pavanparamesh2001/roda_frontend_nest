import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./company/company.component').then(m => m.CompanyComponent),
  },
  {
    path: 'issues',
    loadComponent: () =>
      import('./issue/issues.component').then(m => m.IssuesComponent),
  },
  {
    path: 'state',
    loadComponent: () =>
      import('./state/state.component').then(m => m.StateComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./user/user.component').then(m => m.UserComponent),
  },

  // DEFAULT
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];




