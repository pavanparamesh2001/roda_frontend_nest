// src/app/agent/agent.routes.ts
import { Routes } from '@angular/router';
import { CreatecaseComponent } from './createcase/createcase.component';
import { CaseDashboardComponent } from './case-dashboard/case-dashboard.component';
import { MyCasesComponent } from './my-cases/my-cases.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { ROLES } from '../constants/roles';

export const AGENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.AGENT] },  // 🔒 ONLY AGENT ACCESS

    children: [
      { path: 'dashboard', component: MyCasesComponent },
      { path: 'my-cases', component: MyCasesComponent },
      { path: 'createcase', component: CreatecaseComponent },
      { path: 'case-dashboard/:id', component: CaseDashboardComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];




