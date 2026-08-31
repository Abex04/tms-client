import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { EnrollmentStore } from './enrollment.store';
import { LiveSync } from '../services/live-sync';

describe('EnrollmentStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // The store's onInit hook calls listenForLiveUpdates(), which
        // calls sync.connect() and subscribes to sync.events$. A fake
        // LiveSync with a no-op connect() and an empty events$ stream
        // keeps the test isolated - no real WebSocket connection attempt,
        // same principle as NSubstitute mocking on the backend.
        {
          provide: LiveSync,
          useValue: {
            connect: () => {},
            events$: of(),
          },
        },
      ],
    });
  });

  it('seed() sets entities() length and the first row courseName correctly', () => {
    const store = TestBed.inject(EnrollmentStore);

    store.seed([
      { id: 1, studentId: 11, studentName: 'Abeba', courseId: 101, courseName: 'Intro to CS', status: 'Pending', enrolledAt: '2026-08-12T10:00:00Z' },
      { id: 2, studentId: 12, studentName: 'Kebede', courseId: 102, courseName: 'Data Structures', status: 'Approved', enrolledAt: '2026-08-12T10:05:00Z' },
    ]);

    expect(store.entities()).toHaveLength(2);
    expect(store.entities()[0].courseName).toBe('Intro to CS');
  });

  it('pendingCount() computed signal returns the count of Pending entities only', () => {
    const store = TestBed.inject(EnrollmentStore);

    store.seed([
      { id: 1, studentId: 11, studentName: 'Abeba', courseId: 101, courseName: 'Intro to CS', status: 'Pending', enrolledAt: '2026-08-12T10:00:00Z' },
      { id: 2, studentId: 12, studentName: 'Kebede', courseId: 102, courseName: 'Data Structures', status: 'Approved', enrolledAt: '2026-08-12T10:05:00Z' },
      { id: 3, studentId: 13, studentName: 'Marta', courseId: 101, courseName: 'Intro to CS', status: 'Pending', enrolledAt: '2026-08-12T10:10:00Z' },
    ]);

    expect(store.pendingCount()).toBe(2);
  });
});
