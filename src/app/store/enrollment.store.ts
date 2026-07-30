// Import Angular core functions
import { computed, inject } from '@angular/core';

// Import SignalStore building blocks
import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from '@ngrx/signals';

// Import entity management functions
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

// Import rxMethod for reactive method handling
import { rxMethod } from '@ngrx/signals/rxjs-interop';

// Import RxJS operators
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';

// Import the EnrollmentService and Enrollment model
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';

// Create the EnrollmentStore
export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  // withState adds simple properties alongside the entity collection
  withState({
    isLoading: false,
    error: null as string | null,
    currentCourseId: null as number | null,
  }),

  // withEntities creates an ID-indexed dictionary for the enrollment collection
  withEntities<Enrollment>(),

  // withComputed creates read-only derived signals
  withComputed((store) => ({
    enrollmentCount: computed(() => store.entities().length),
  })),

  // withMethods defines functions that can update the store state
  withMethods((store, api = inject(EnrollmentService)) => ({
    /**
     * Load enrollments for a specific course
     */
    loadEnrollments: rxMethod<number>(
      pipe(
        tap((courseId) => patchState(store, { isLoading: true, error: null, currentCourseId: courseId })),
        concatMap((courseId) =>
          api.getByCourse(courseId).pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), { isLoading: false })
            ),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return EMPTY;
            })
          )
        )
      )
    ),

    /**
     * Approve an enrollment (placeholder - API may not have this endpoint yet)
     */
    approveEnrollment: rxMethod<{ courseId: number; enrollmentId: number }>(
      pipe(
        tap(({ courseId, enrollmentId }) => {
          console.log(`Optimistically approving enrollment ${enrollmentId}`);
          // For now, we just log it since the approve endpoint doesn't exist
          patchState(store, {
            error: 'Approve endpoint not implemented in API yet. Check console for log.',
          });
        })
      )
    ),
  }))
);
