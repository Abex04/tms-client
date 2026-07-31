import { Routes } from '@angular/router';
import { InstructorDashboardComponent } from './features/instructor-dashboard/instructor-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InstructorDashboardComponent }
];
