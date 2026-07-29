// Import Component, input, and output from Angular core
// - input: allows parent components to pass data into this child component
// - output: allows this child component to send events back to the parent
import { Component, input, output } from '@angular/core';

// Import RouterLink for navigation (so we can use routerLink in the template)
import { RouterLink } from '@angular/router';

// Import the Course interface that defines the shape of course data
import { Course } from '../../models/course.model';

@Component({
  selector: 'tms-course-card',  // Custom HTML tag: <tms-course-card />
  // Add RouterLink to imports so we can use the routerLink directive in the template
  imports: [RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  // input.required<Course>() - This declares that the parent component MUST pass a Course object
  // The <Course> part is a TypeScript generic - it tells Angular the type of data expected
  // If the parent forgets to pass the course, Angular throws a compile-time error
  // Think of it like a required parameter on a C# method
  course = input.required<Course>();

  // output<Course>() - This declares that this child component can send a Course event
  // The parent listens for this event the same way you listen for a button click
  // When the user clicks "Enroll", we emit the course object to the parent
  enrollClicked = output<Course>();
}
