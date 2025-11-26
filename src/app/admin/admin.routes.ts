// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { ROLES } from '../constants/roles';
import { VendorlistwidgetComponent } from './vendorlistwidget/vendorlistwidget.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.ADMIN] }, // ONLY ADMIN ACCESS

    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent),
      },

      // 🌟 VENDOR REGISTRATION ROUTES
      {
  path: 'vendors/create',
  loadComponent: () =>
    import('./vendor-registration/vendor-registration.component')
      .then(m => m.VendorRegistrationComponent),
},
{
  path: 'vendors/:id/edit',
  loadComponent: () =>
    import('./vendor-registration/vendor-registration.component')
      .then(m => m.VendorRegistrationComponent),
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
         // ⭐ NEW: VENDOR LIST PAGE
     {
  path: 'vendors',
  loadComponent: () =>
    import('./vendor-list/vendor-list.component')
      .then(m => m.VendorListComponent),
},

      

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];







