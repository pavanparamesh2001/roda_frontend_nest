// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const appRoutes: Routes = [

  // ─── ADMIN SECTION ────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),

    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES),
  },

  // ─── AGENT SECTION ────────────────────────────────────────
  {
    path: 'agent',
    loadComponent: () =>
      import('./agent/agent-layout/agent-layout.component')
        .then(m => m.AgentLayoutComponent),

    loadChildren: () =>
      import('./agent/agent.routes')
        .then(m => m.AGENT_ROUTES),
  },
 // ─── ACCESS DENIED PAGE ────────────────────────────────────
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./access-denied/access-denied.component')
        .then(m => m.AccessDeniedComponent),
  },
  // ─── LOGIN PAGE ───────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent),
  },

  // ─── DEFAULT ROUTE ─────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ─── WILDCARD / 404 FALLBACK ───────────────────────────────
  { path: '**', redirectTo: 'login' },
];



