// Import Angular core functions for components, signals, and computed values
import { Component, signal, computed } from '@angular/core';

// Import the CourseCard component so we can use it in the template
// This is how standalone components manage their dependencies
import { CourseCardComponent } from '../../ui/course-card/course-card.component';

// Import the Course interface that defines the shape of course data
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  // imports array tells Angular: "I use CourseCardComponent in my template"
  // If you use <tms-course-card> in the template but don't add it here,
  // Angular doesn't know what that tag is and renders it as plain text
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  // --- Student Information (from Exercise 1) ---
  // signal('Liya Kebede') creates a reactive variable for the student name
  studentName = signal('Liya Kebede');
  
  // signal(45) creates a reactive variable for earned credits
  earnedCredits = signal(45);

  // computed() creates a read-only signal that recalculates when earnedCredits changes
  // When credits reach 120, status changes from "In Progress" to "Eligible for Graduation"
  graduationStatus = computed(() => 
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress'
  );

  // --- Exercise 3: Loops, Conditionals, and the Empty State ---
  
  // availableCourses is a signal that holds an array of Course objects
  // This replaces the single sampleCourse from Exercise 2
  availableCourses = signal<Course[]>([
    {
      id: 1,
      title: 'Advanced Java Services',
      code: 'CSE-101',
      maxCapacity: 30,
      enrollmentCount: 10,
    },
    {
      id: 2,
      title: 'Angular UI Lab',
      code: 'CSE-210',
      maxCapacity: 25,
      enrollmentCount: 25,  // This course is FULL (enrollmentCount == maxCapacity)
    },
    {
      id: 3,
      title: 'Database Design',
      code: 'CSE-305',
      maxCapacity: 20,
      enrollmentCount: 18,
    },
    {
      id: 4,
      title: 'API Security Workshop',
      code: 'CSE-420',
      maxCapacity: 40,
      enrollmentCount: 15,
    },
  ]);

  // signal<Course | null>(null) holds the currently selected course
  // Initially null - no course is selected yet
  selectedCourse = signal<Course | null>(null);

  // Handler for the enroll event from the child component
  // When the child calls enrollClicked.emit(course), this method runs
  // Updates the selectedCourse signal and logs to console for debugging
  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }

  // --- Methods from Exercise 1 ---
  // registerForClass() updates the earnedCredits signal by adding 3
  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }
}
