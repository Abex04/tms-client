import { Component, Input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  template: `
    <div class="h-40 flex items-center justify-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
      <div class="text-center">
        <p class="text-sm font-medium">Analytics Dashboard</p>
        <p class="text-xs mt-1">Loaded with {{ data?.length || 0 }} records</p>
      </div>
    </div>
  `,
  styles: []
})
export class AnalyticsChartComponent {
  @Input() data: Enrollment[] | null = null;
}
