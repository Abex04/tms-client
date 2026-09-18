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
    // Lets tests set up known entity state directly, without going
    // through loadEnrollments()'s real HTTP call.
    seed: (rows: Enrollment[]) => {
      patchState(store, setAllEntities(rows));
    },

    // Loads the real cross-course enrollment list from the backend
    // (GET /api/enrollments), replacing the earlier hardcoded mock data -
    // this is what makes approve/reject state actually survive a refresh.
    loadEnrollments: () => {
      patchState(store, { isLoading: true, error: null });
      api.getAll().subscribe({
        next: (rows) => {
          patchState(store, setAllEntities(rows), { isLoading: false });
        },
        error: (err) => {
          patchState(store, { isLoading: false, error: err.message ?? 'Failed to load enrollments' });
        }
      });
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

    // Mirrors approveEnrollment - same real backend call, same optimistic
    // patch, same SignalR broadcast pattern, just for rejection.
    rejectEnrollment: ({ courseId, enrollmentId }: { courseId: number; enrollmentId: number }) => {
      api.reject(courseId, enrollmentId).subscribe({
        next: () => {
          patchState(store, updateEntity({ id: enrollmentId, changes: { status: 'Rejected' } }));
        },
        error: (err) => {
          patchState(store, { error: err.message ?? 'Failed to reject enrollment' });
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
