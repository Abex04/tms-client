// Import Angular core functions for components, signals, computed values, and dependency injection
import { Component, signal, computed, inject } from '@angular/core';

// Import rxResource - Angular's bridge between Observables and Signals
// It handles subscribing (starting the request) and unsubscribing (cleaning up)
// if the user navigates away before the response arrives - automatically.
// You never write .subscribe() or .unsubscribe() with rxResource.
import { rxResource } from '@angular/core/rxjs-interop';

// Import the CourseCard component so we can use it in the template
import { CourseCardComponent } from '../../ui/course-card/course-card.component';

// Import the Course interface that defines the shape of course data
import { Course } from '../../models/course.model';

// Import the CourseService to make API calls
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-student-dashboard',
  // imports array tells Angular: "I use CourseCardComponent in my template"
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  // --- Dependency Injection ---
  // inject(CourseService) requests the service we just created.
  // Angular finds the singleton instance and gives it to us.
  // This is similar to constructor injection in .NET
  private api = inject(CourseService);

  // --- Student Information (from Exercise 1) ---
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress'
  );

  // --- Exercise 6: Live API Integration ---
  // rxResource wraps the HTTP call into three managed signals:
  // - coursesResource.isLoading() -> true while waiting for the server response
  // - coursesResource.error() -> the error object if the request fails
  // - coursesResource.value() -> the Course[] array when the request succeeds
  //
  // It handles subscribing (starting the request) and unsubscribing (cleaning up
  // if the user navigates away before the response arrives) automatically.
  coursesResource = rxResource({
    // stream: a function that returns an Observable
    // When Angular loads this component, it automatically calls this function
    // and subscribes to the Observable to start the HTTP request
    stream: () => this.api.getAll(),
  });

  // --- State for selected course (from Exercise 2/3) ---
  selectedCourse = signal<Course | null>(null);

  // Handler for the enroll event from the child component
  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }

  // --- Methods from Exercise 1 ---
  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }
}
