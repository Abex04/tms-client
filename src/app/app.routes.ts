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
import { SignUp } from './features/signup/signup';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { ResetPassword } from './features/reset-password/reset-password';
import { Profile } from './features/profile/profile';

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
  , { path: 'signup', component: SignUp }
  , { path: 'forgot-password', component: ForgotPassword }
  , { path: 'reset-password', component: ResetPassword }
  , { path: 'profile', component: Profile }
];
