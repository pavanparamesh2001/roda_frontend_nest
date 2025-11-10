// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'companies',
    loadComponent: () =>
      import('./company/company.component').then((m) => m.CompanyComponent),
  },
   {
    path: 'issues', // ✅ Route path for issues
    loadComponent: () =>
      import('./issue/issues.component').then((m) => m.IssuesComponent), // ✅ Correct import path and export name
  },
{
    path: 'state',
    loadComponent: () =>
      import('./state/state.component').then((m) => m.StateComponent),
  },
];
