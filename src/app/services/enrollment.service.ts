import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

export interface ScheduleItem {
  courseCode: string;
  title: string;
  schedule: string;
}

export interface Schedule {
  studentId: number;
  courses: ScheduleItem[];
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/courses';

  // Flat cross-course list for the instructor dashboard - replaces the
  // old hardcoded mock data in EnrollmentStore.loadEnrollments().
  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>('/api/enrollments');
  }

  getByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/${courseId}/enrollments`);
  }

  approve(courseId: number, enrollmentId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${courseId}/enrollments/${enrollmentId}/approve`, {});
  }

  reject(courseId: number, enrollmentId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${courseId}/enrollments/${enrollmentId}/reject`, {});
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

  async getSchedule(studentId: number): Promise<Schedule> {
    return firstValueFrom(
      this.http.get<Schedule>(`/api/v2/enrollments/${studentId}/schedule`)
    );
  }
}
