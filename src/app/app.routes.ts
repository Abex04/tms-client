import { Routes } from '@angular/router';
import { InstructorDashboardComponent } from './features/instructor-dashboard/instructor-dashboard.component';
import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';
import { GradeSubmission } from './features/grade-submission/grade-submission';
import { CourseCatalog } from './features/course-catalog/course-catalog';
import { AdminCourseList } from './features/admin-course-list/admin-course-list';
import { Unauthorized } from './features/unauthorized/unauthorized';
import { roleGuard } from './guards/role.guard';
import { Login } from './features/login/login';
import { Welcome } from './features/welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'dashboard', component: InstructorDashboardComponent },
  { path: 'list', component: EnrollmentListComponent }
  , { path: 'grade-submission', component: GradeSubmission }
  , { path: 'courses', component: CourseCatalog }
  , { path: 'admin/courses', component: AdminCourseList, canActivate: [roleGuard('Admin')] }
  , { path: 'unauthorized', component: Unauthorized }
  , { path: 'login', component: Login }
  , { path: 'welcome', component: Welcome }
];
