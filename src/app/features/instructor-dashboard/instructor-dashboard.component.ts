import { Component, inject } from '@angular/core';
import { AnalyticsChartComponent } from '../analytics-chart/analytics-chart.component';
import { EnrollmentListComponent } from '../enrollment-list/enrollment-list.component';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent, EnrollmentListComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent {
  store = inject(EnrollmentStore);
}
