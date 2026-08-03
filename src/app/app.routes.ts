import { Routes } from '@angular/router';
import { InstructorDashboardComponent } from './features/instructor-dashboard/instructor-dashboard.component';
import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InstructorDashboardComponent },
  { path: 'list', component: EnrollmentListComponent }
];
