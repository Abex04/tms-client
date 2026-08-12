import { Component, inject, viewChild, effect } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.component.html',
  // Added: without this, enrollment-list.component.scss is never
  // compiled or injected, so .approve-btn, .status-badge, etc. never apply.
  styleUrl: './enrollment-list.component.scss',
})
export class EnrollmentListComponent {
  store = inject(EnrollmentStore);
  displayedColumns: string[] = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);
  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });
    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();
      if (paginator && sort) {
        this.dataSource.paginator = paginator;
        this.dataSource.sort = sort;
      }
    });
  }
  onApprove(id: number) {
    this.store.approveEnrollment({
      courseId: 1,
      enrollmentId: id
    });
  }
}
