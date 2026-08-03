import { computed, signal } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState, withHooks } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({ isLoading: false, error: null as string | null }),
  withEntities<Enrollment>(),
  withComputed((store) => ({
    pendingCount: computed(() => store.entities().filter(e => e.status === 'Pending').length)
  })),
  withMethods((store) => ({
    loadEnrollments: () => {
      const mockData: Enrollment[] = [
        { id: 1, studentId: 1, studentName: 'Alice Smith', courseId: 1, courseName: 'CS-101', status: 'Pending', enrolledAt: new Date().toISOString() },
        { id: 2, studentId: 2, studentName: 'Bob Jones', courseId: 1, courseName: 'CS-101', status: 'Pending', enrolledAt: new Date().toISOString() }
      ];
      patchState(store, setAllEntities(mockData));
    },
    approveEnrollment: ({ enrollmentId }: { courseId: number; enrollmentId: number }) => {
      patchState(store, updateEntity({ id: enrollmentId, changes: { status: 'Approved' } }));
    }
  })),
  withHooks({
    onInit(store) {
      // Load the data the moment the store is created
      store.loadEnrollments();
    }
  })
);