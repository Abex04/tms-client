import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState, withHooks } from '@ngrx/signals';
import { withEntities, setAllEntities, removeEntity } from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({ isLoading: false, error: null as string | null }),
  withEntities<Course>(),
  withComputed((store) => ({
    totalCourses: computed(() => store.entities().length),
  })),
  withMethods((store, svc = inject(CourseService)) => ({
    loadCourses() {
      patchState(store, { isLoading: true, error: null });
      svc.getAll().subscribe({
        next: (courses) => {
          patchState(store, setAllEntities(courses));
          patchState(store, { isLoading: false });
        },
        error: () => {
          patchState(store, { isLoading: false, error: 'Failed to load courses' });
        },
      });
    },

    // M10 Session 3: optimistic delete with automatic rollback.
    // EXECUTION ORDER RULE: the snapshot MUST be captured before
    // patchState(removeEntity(...)) - snapshotting after would already be
    // missing the deleted item, making rollback impossible.
    deleteCourse(id: number) {
      const previousSnapshot = store.entities();

      // Instant visual feedback - card disappears immediately, no waiting
      // for the network round-trip.
      patchState(store, removeEntity(id));

      svc.delete(id).pipe(
        catchError((err) => {
          // Server rejected the delete (e.g. 409 - active enrollments still
          // exist) - restore the exact previous state and surface why.
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: err.error?.detail ?? 'Cannot delete course: active student enrollments exist.',
          });
          return EMPTY;
        })
      ).subscribe();
    },
  })),
  withHooks({
    onInit(store) {
      store.loadCourses();
    },
  })
);
