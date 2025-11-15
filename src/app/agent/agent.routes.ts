// src/app/agent/agent.routes.ts
import { Routes } from '@angular/router';
import { CreatecaseComponent } from './createcase/createcase.component';
import { CaseDashboardComponent } from './case-dashboard/case-dashboard.component';
import { CaseListWidgetComponent } from './case-list-widget/case-list-widget.component';

export const AGENT_ROUTES: Routes = [

  // Agent Dashboard (home)
  { path: 'dashboard', component: CaseListWidgetComponent },

  // Case list widget page
  { path: 'case-list', component: CaseListWidgetComponent },

  // Case create page
  { path: 'createcase', component: CreatecaseComponent },

  // Dynamic case dashboard
  { path: 'case-dashboard/:id', component: CaseDashboardComponent },

  // Default → redirect to dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

