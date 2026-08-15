import { Routes } from '@angular/router';
import { InstructorDashboardComponent } from './features/instructor-dashboard/instructor-dashboard.component';
import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';
import { GradeSubmission } from './features/grade-submission/grade-submission';
import { CourseCatalog } from './features/course-catalog/course-catalog';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InstructorDashboardComponent },
  { path: 'list', component: EnrollmentListComponent }
  , { path: 'grade-submission', component: GradeSubmission }
  , { path: 'courses', component: CourseCatalog }
];
