import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AuthService } from '../../services/auth.service';
import { AnalyticsChartComponent } from '../analytics-chart/analytics-chart.component';
import { EnrollmentListComponent } from '../enrollment-list/enrollment-list.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent, EnrollmentListComponent],
  templateUrl: './instructor-dashboard.component.html',
})
export class InstructorDashboardComponent {
  store = inject(EnrollmentStore);
  auth = inject(AuthService);
  private router = inject(Router);

  isProfileMenuOpen = signal(false);

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((open) => !open);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
