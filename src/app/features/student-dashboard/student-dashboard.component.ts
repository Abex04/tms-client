import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentsService, CurrentStudent } from '../../services/students.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  private courseApi = inject(CourseService);
  private enrollmentApi = inject(EnrollmentService);
  private studentsApi = inject(StudentsService);
  auth = inject(AuthService);

  // The logged-in user's linked Student domain record (id, registration
  // number, gpa). Loaded once on init - needed because enrollment calls
  // require the numeric Student.Id, not the Identity account.
  currentStudent = signal<CurrentStudent | null>(null);
  studentLoadError = signal('');

  coursesResource = rxResource({
    stream: () => this.courseApi.getAll(),
  });

  selectedCourse = signal<Course | null>(null);
  enrollError = signal('');
  enrollSuccess = signal('');
  isEnrolling = signal(false);

  constructor() {
    this.loadCurrentStudent();
  }

  private async loadCurrentStudent() {
    try {
      const student = await this.studentsApi.getMe();
      this.currentStudent.set(student);
    } catch {
      this.studentLoadError.set('Could not load your student record.');
    }
  }

  async handleEnroll(course: Course) {
    const student = this.currentStudent();
    if (!student || this.isEnrolling()) return;

    this.enrollError.set('');
    this.enrollSuccess.set('');
    this.isEnrolling.set(true);
    this.selectedCourse.set(course);

    try {
      await this.enrollmentApi.enroll(student.id, course.code);
      this.enrollSuccess.set(`Enrollment request sent for ${course.title}.`);
    } catch (err: any) {
      this.enrollError.set(err.error?.detail ?? 'Enrollment failed. Please try again.');
    } finally {
      this.isEnrolling.set(false);
    }
  }
}
