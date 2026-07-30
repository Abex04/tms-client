import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-enrollment-list',
  imports: [DatePipe],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss',
})
export class EnrollmentListComponent implements OnInit {
  store = inject(EnrollmentStore);

  courseId = signal(1);

  ngOnInit() {
    this.store.loadEnrollments(this.courseId());
  }

  onApprove(id: number) {
    this.store.approveEnrollment({
      courseId: this.courseId(),
      enrollmentId: id
    });
  }
}
