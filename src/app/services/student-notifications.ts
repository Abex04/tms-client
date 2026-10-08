import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { LiveSync } from './live-sync';
import { EnrollmentService } from './enrollment.service';
import { ToastService } from './toast.service';

// Listens to the live-sync broadcast and shows a toast when one of THIS
// student's own enrollments changes status. The backend broadcasts every
// status change to every connected client (Clients.All), so matching is
// done here on the frontend using the student's own enrollment IDs.
@Injectable({
  providedIn: 'root',
})
export class StudentNotifications {
  private sync = inject(LiveSync);
  private enrollmentApi = inject(EnrollmentService);
  private toast = inject(ToastService);

  private initializedForStudentId: number | null = null;
  private studentId: number | null = null;
  private eventsSubscription: Subscription | null = null;
  private courseNameByEnrollmentId = new Map<number, string>();

  async initialize(studentId: number): Promise<void> {
    if (this.initializedForStudentId === studentId) return;
    this.initializedForStudentId = studentId;
    this.studentId = studentId;

    await this.refreshEnrollmentLookup();

    this.sync.connect();
    this.eventsSubscription?.unsubscribe();
    this.eventsSubscription = this.sync.events$.subscribe(async (event) => {
      const enrollmentId = Number(event.id);
      let courseName = this.courseNameByEnrollmentId.get(enrollmentId);

      if (!courseName) {
        // Might be a very recently created enrollment we haven't cached yet.
        await this.refreshEnrollmentLookup();
        courseName = this.courseNameByEnrollmentId.get(enrollmentId);
      }

      // Not one of this student's own enrollments - ignore (Clients.All
      // broadcasts every student's status changes to every connection).
      if (!courseName) return;

      if (event.status === 'Approved') {
        this.toast.show(`Your enrollment in ${courseName} was approved.`, 'success');
      } else if (event.status === 'Rejected') {
        this.toast.show(`Your enrollment in ${courseName} was rejected.`, 'error');
      }
    });
  }

  private async refreshEnrollmentLookup(): Promise<void> {
    if (this.studentId == null) return;
    try {
      const all = await firstValueFrom(this.enrollmentApi.getAll());
      this.courseNameByEnrollmentId.clear();
      for (const e of all) {
        if (e.studentId === this.studentId) {
          this.courseNameByEnrollmentId.set(e.id, e.courseName);
        }
      }
    } catch {
      // Non-fatal - a toast just won't resolve a course name until the
      // next successful refresh.
    }
  }
}
