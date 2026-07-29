// Import the Routes type from Angular Router - this defines the shape of our route configuration
import { Routes } from '@angular/router';

// routes array tells Angular which component to display for each URL in the browser
// This is the routing table for the entire application
export const routes: Routes = [
  { 
    // When the browser URL is /dashboard, load the Student Dashboard component
    path: 'dashboard',
    
    // loadComponent uses lazy loading - the dashboard code loads only when the user visits /dashboard
    // Benefits: faster initial app load, less bandwidth used for users who never visit the dashboard
    // The arrow function dynamically imports the component file when needed
    // .then(m => m.StudentDashboardComponent) extracts the specific class from the imported file
    loadComponent: () => import('./features/student-dashboard/student-dashboard.component')
      .then(m => m.StudentDashboardComponent),
  },
  { 
    // Default route: if someone visits the root URL (http://localhost:4200/), 
    // automatically send them to /dashboard
    path: '',
    redirectTo: 'dashboard',  // The URL to redirect to
    
    // pathMatch: 'full' ensures the redirect only happens if the full path matches exactly ''
    // Without this, Angular might redirect even on partial matches (e.g., '/dashboard/123')
    pathMatch: 'full'
  }
];
