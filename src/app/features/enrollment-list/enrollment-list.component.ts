import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  templateUrl: './enrollment-list.component.html',
})
export class EnrollmentListComponent implements OnInit {
  store = inject(EnrollmentStore);

  ngOnInit() {
    this.store.loadEnrollments(); // Removed the argument because mock data takes 0 args
  }

  onApprove(id: number) {
    this.store.approveEnrollment({
      courseId: 1, // Hardcoded to 1 for the mock data test
      enrollmentId: id
    });
  }
}
