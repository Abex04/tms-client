import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/courses';

  getByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/${courseId}/enrollments`);
  }

  approve(courseId: number, enrollmentId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${courseId}/enrollments/${enrollmentId}/approve`, {});
  }

  // Student self-enrollment via the V2 endpoint. Backend enforces business
  // rules (course full, already enrolled, etc.) and returns typed errors -
  // callers should catch and read err.error?.detail for the message.
  async enroll(studentId: number, courseCode: string): Promise<void> {
    await firstValueFrom(
      this.http.post('/api/v2/enrollments', {
        studentId,
        courseCode,
      })
    );
  }
}
