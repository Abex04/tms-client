import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState, withHooks } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { EnrollmentService } from '../services/enrollment.service';
import { LiveSync } from '../services/live-sync';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({ isLoading: false, error: null as string | null }),
  withEntities<Enrollment>(),
  withComputed((store) => ({
    pendingCount: computed(() => store.entities().filter(e => e.status === 'Pending').length)
  })),
  withMethods((
    store,
    api = inject(EnrollmentService),
    sync = inject(LiveSync)
  ) => ({
    // Mock data for now — this store isn't wired to a real GET endpoint yet
    // (a separate change outside this session's scope). What matters here
    // is that approveEnrollment below now makes a REAL backend call.
    // M12 Session 2: lets tests set up known entity state directly,
    // without going through loadEnrollments()'s hardcoded mock data.
    seed: (rows: Enrollment[]) => {
      patchState(store, setAllEntities(rows));
    },

    loadEnrollments: () => {
      const mockData: Enrollment[] = [
        { id: 1, studentId: 1, studentName: 'Alice Smith', courseId: 1, courseName: 'CS-101', status: 'Pending', enrolledAt: new Date().toISOString() },
        { id: 2, studentId: 2, studentName: 'Bob Jones', courseId: 1, courseName: 'CS-101', status: 'Pending', enrolledAt: new Date().toISOString() }
      ];
      patchState(store, setAllEntities(mockData));
    },

    // Now calls the real backend approve endpoint. On success, patches
    // local state optimistically — the SignalR broadcast will ALSO patch
    // this same entity a moment later (redundant on the tab that clicked,
    // but that's what proves the round-trip is real on the OTHER tab).
    approveEnrollment: ({ courseId, enrollmentId }: { courseId: number; enrollmentId: number }) => {
      api.approve(courseId, enrollmentId).subscribe({
        next: () => {
          patchState(store, updateEntity({ id: enrollmentId, changes: { status: 'Approved' } }));
        },
        error: (err) => {
          patchState(store, { error: err.message ?? 'Failed to approve enrollment' });
        }
      });
    },

    // Listens to the SignalR live sync stream and updates store state
    // automatically — this is what lets OTHER open tabs pick up the change
    // without polling or refreshing.
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap(event => {
          patchState(
            store,
            updateEntity({ id: Number(event.id), changes: { status: event.status } })
          );
        })
      )
    )
  })),
  withHooks({
    onInit(store) {
      store.loadEnrollments();
      store.listenForLiveUpdates();
    }
  })
);
