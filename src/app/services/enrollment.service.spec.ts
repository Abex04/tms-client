import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let httpMock: HttpTestingController;
  let service: EnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EnrollmentService);
  });

  afterEach(() => httpMock.verify());

  it('getByCourse(courseId) issues GET /api/courses/{courseId}/enrollments and returns the array', async () => {
    const result = firstValueFrom(service.getByCourse(101));

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/courses/101/enrollments'));
    expect(req.request.method).toBe('GET');

    req.flush([
      { id: 1, studentId: 11, studentName: 'Abeba', courseId: 101, courseName: 'Intro to CS', status: 'Pending', enrolledAt: '2026-08-12T10:00:00Z' },
      { id: 2, studentId: 12, studentName: 'Kebede', courseId: 101, courseName: 'Intro to CS', status: 'Approved', enrolledAt: '2026-08-12T10:05:00Z' },
    ]);

    const enrollments = await result;
    expect(enrollments).toHaveLength(2);
    expect(enrollments[0].courseName).toBe('Intro to CS');
  });

  it('approve(courseId, enrollmentId) issues POST /api/courses/{courseId}/enrollments/{enrollmentId}/approve', async () => {
    const result = firstValueFrom(service.approve(101, 42));

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/courses/101/enrollments/42/approve'));
    expect(req.request.method).toBe('POST');

    // approve() returns Observable<void> - the backend actually responds
    // 204 No Content, so we flush an empty body, not an enrollment object.
    req.flush(null);

    await expect(result).resolves.toBeNull();
  });
});
