import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  // Use the full API URL with the correct port
  private baseUrl = 'http://localhost:5189/api';

  getByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/courses/${courseId}/enrollments`);
  }

  approve(courseId: number, enrollmentId: number): Observable<void> {
    console.log(`Approving enrollment ${enrollmentId} for course ${courseId}`);
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }
}
