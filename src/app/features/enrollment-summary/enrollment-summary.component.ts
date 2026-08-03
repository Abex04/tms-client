import { Component, inject, effect } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-enrollment-summary',
  standalone: true,
  template: `
    <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; max-width: 300px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 1.1rem;">Dashboard Summary</h3>
      <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #2563eb;">
        Pending: {{ store.pendingCount() }}
      </p>
    </div>
  `
})
export class EnrollmentSummaryComponent {
  store = inject(EnrollmentStore);

  // This effect forces the component to track the pendingCount signal
  constructor() {
    effect(() => {
      // We read the signal here to force Angular to listen to it
      const count = this.store.pendingCount();
      console.log('Pending count updated to:', count);
    });
  }
}
