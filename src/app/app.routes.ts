// Import the Routes type from Angular Router - this defines the shape of our route configuration
import { Routes } from '@angular/router';

// routes array tells Angular which component to display for each URL in the browser
// This is the routing table for the entire application
export const routes: Routes = [
  {
    // When the browser URL is /dashboard, load the Student Dashboard component
    path: 'dashboard',
    loadComponent: () => import('./features/student-dashboard/student-dashboard.component')
      .then(m => m.StudentDashboardComponent),
  },
  {
    // When the browser URL is /courses/:id (e.g., /courses/1), load the Course Detail component
    path: 'courses/:id',
    loadComponent: () => import('./features/course-detail/course-detail.component')
      .then(m => m.CourseDetailComponent),
  },
  {
    // When the browser URL is /enroll, load the Enrollment Form component
    path: 'enroll',
    loadComponent: () => import('./features/enrollment-form/enrollment-form.component')
      .then(m => m.EnrollmentFormComponent),
  },
  {
    // When the browser URL is /enrollments, load the Enrollment List component
    path: 'enrollments',
    loadComponent: () => import('./features/enrollment-list/enrollment-list.component')
      .then(m => m.EnrollmentListComponent),
  },
  {
    // When the browser URL is /instructor-dashboard, load the Instructor Dashboard component
    path: 'instructor-dashboard',
    loadComponent: () => import('./features/instructor-dashboard/instructor-dashboard.component')
      .then(m => m.InstructorDashboardComponent),
  },
  {
    // Default route: redirect to /dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
