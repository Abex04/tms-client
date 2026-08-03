import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
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
}
