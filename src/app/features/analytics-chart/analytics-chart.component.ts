// Import Component, input from Angular core
import { Component, input } from '@angular/core';

// Import the Enrollment model
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-analytics-chart',
  imports: [],
  templateUrl: './analytics-chart.component.html',
  styleUrl: './analytics-chart.component.scss',
})
export class AnalyticsChartComponent {
  // Input for the chart data
  data = input<Enrollment[]>([]);

  // Simple computed to show count
  get enrollmentCount() {
    return this.data().length;
  }
}
