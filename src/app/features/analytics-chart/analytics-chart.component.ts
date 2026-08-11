import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  template: `
    <div class="rounded-lg border border-slate-200 bg-white p-6">
      <!-- Bars -->
      <div class="flex items-end justify-center gap-8 h-40">
        <!-- Approved bar -->
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs font-semibold text-slate-600">{{ approvedCount() }}</span>
          <div
            class="w-14 rounded-t-md bg-emerald-500 transition-all duration-500"
            [style.height.px]="approvedHeight()">
          </div>
          <span class="text-xs font-medium text-slate-500">Approved</span>
        </div>

        <!-- Pending bar -->
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs font-semibold text-slate-600">{{ pendingCount() }}</span>
          <div
            class="w-14 rounded-t-md bg-amber-500 transition-all duration-500"
            [style.height.px]="pendingHeight()">
          </div>
          <span class="text-xs font-medium text-slate-500">Pending</span>
        </div>

        <!-- Rejected bar -->
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs font-semibold text-slate-600">{{ rejectedCount() }}</span>
          <div
            class="w-14 rounded-t-md bg-red-500 transition-all duration-500"
            [style.height.px]="rejectedHeight()">
          </div>
          <span class="text-xs font-medium text-slate-500">Rejected</span>
        </div>
      </div>

      <!-- Summary -->
      <p class="text-center text-xs text-slate-400 mt-4">
        Total records: {{ data().length }}
      </p>
    </div>
  `,
  styles: []
})
export class AnalyticsChartComponent {
  // Signal input — required, matches the signal-first pattern used
  // throughout this project (EnrollmentStore, etc.)
  data = input.required<Enrollment[]>();

  // computed() memoizes each count — only re-runs when data() changes,
  // not on every change detection cycle.
  approvedCount = computed(() => this.data().filter(e => e.status === 'Approved').length);
  pendingCount = computed(() => this.data().filter(e => e.status === 'Pending').length);
  rejectedCount = computed(() => this.data().filter(e => e.status === 'Rejected').length);

  // Bar heights scale with count; minimum 20px so a bar with 0 records
  // still shows a visible baseline instead of disappearing.
  approvedHeight = computed(() => Math.max(20, this.approvedCount() * 30));
  pendingHeight = computed(() => Math.max(20, this.pendingCount() * 30));
  rejectedHeight = computed(() => Math.max(20, this.rejectedCount() * 30));
}
