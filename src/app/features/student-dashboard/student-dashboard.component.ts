import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentsService, CurrentStudent } from '../../services/students.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CourseCardComponent, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  private courseApi = inject(CourseService);
  private enrollmentApi = inject(EnrollmentService);
  private studentsApi = inject(StudentsService);
  private router = inject(Router);
  auth = inject(AuthService);

  // The logged-in user's linked Student domain record (id, registration
  // number, gpa). Loaded once on init - needed because enrollment calls
  // require the numeric Student.Id, not the Identity account.
  currentStudent = signal<CurrentStudent | null>(null);
  studentLoadError = signal('');

  coursesResource = rxResource({
    stream: () => this.courseApi.getAll(),
  });

  // Catalog search: filters the loaded courses by title or code as the
  // student types. Done in the browser - the full list is already loaded.
  searchTerm = signal('');

  filteredCourses = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const courses = this.coursesResource.value() ?? [];
    if (!term) return courses;
    return courses.filter(
      (c) => c.title.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  });

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
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
