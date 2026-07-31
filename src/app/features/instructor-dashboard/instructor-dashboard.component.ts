// Import Component and inject from Angular core
import { Component, inject } from '@angular/core';

// Import the EnrollmentStore for shared state
import { EnrollmentStore } from '../../store/enrollment.store';

// Import the Analytics Chart component (this will be deferred)
import { AnalyticsChartComponent } from '../analytics-chart/analytics-chart.component';

@Component({
  selector: 'app-instructor-dashboard',
  // Import the chart component so we can use it in the template
  imports: [AnalyticsChartComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss',
})
export class InstructorDashboardComponent {
  // Inject the EnrollmentStore to access enrollment data
  store = inject(EnrollmentStore);
}
