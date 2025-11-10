import { Routes } from '@angular/router';
import { CreatecaseComponent } from './createcase/createcase.component';
import { CaseDashboardComponent } from './case-dashboard/case-dashboard.component';
import { CaseListWidgetComponent } from './case-list-widget/case-list-widget.component';

export const AGENT_ROUTES: Routes = [
  { path: 'createcase', component: CreatecaseComponent },
  // 📋 Case list widget page
  { path: 'case-list', component: CaseListWidgetComponent },


  // ✅ Added route with dynamic ID parameter
  { path: 'case-dashboard/:id', component: CaseDashboardComponent },
];
