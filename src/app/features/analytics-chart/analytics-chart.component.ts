import { Component, Input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  template: `<div class="p-4 border rounded shadow-sm bg-white">Analytics Chart Component Loaded with {{ data?.length || 0 }} records</div>`,
  styles: []
})
export class AnalyticsChartComponent {
  @Input() data: Enrollment[] | null = null;
}
