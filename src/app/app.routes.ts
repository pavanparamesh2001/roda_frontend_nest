import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  // 👨‍💼 Agent module
  {
    path: 'agent',
    loadChildren: () =>
      import('./agent/agent.routes').then((m) => m.AGENT_ROUTES),
  },

  // 🧑‍💻 Admin module (includes companies, issues, and state)
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Default redirect to admin/companies
  { path: '', redirectTo: 'admin/companies', pathMatch: 'full' },

  // Wildcard redirect (for invalid URLs)
  { path: '**', redirectTo: 'admin/companies' },
];

