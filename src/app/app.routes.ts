import { Routes } from '@angular/router';
import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';
import { EnrollmentSummaryComponent } from './features/enrollment-summary/enrollment-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: EnrollmentListComponent },
  { path: 'summary', component: EnrollmentSummaryComponent }
];