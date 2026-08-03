import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
