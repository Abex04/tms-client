// Import Component, input, and effect from Angular core
// - input: receives the route parameter from the URL
// - effect: watches signals and runs code when they change
import { Component, input, effect } from '@angular/core';

// Import RouterLink for navigation (so we can use routerLink in the template)
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  // Add RouterLink to imports so we can use the routerLink directive in the template
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  // This automatically receives the :id from the URL /courses/:id
  // Because we enabled withComponentInputBinding() in app.config.ts (Step 2 of Exercise 1),
  // Angular maps the URL parameter ":id" directly to this input.
  // The name must match exactly: the route says ":id", so the input is called "id".
  id = input.required<string>();

  // The constructor runs when the component is created.
  // effect() watches any signals read inside it. Every time id() changes
  // (e.g. navigating from /courses/1 to /courses/2), this code runs again.
  constructor() {
    effect(() => {
      console.log(`Loading course detail for ID: ${this.id()}`);
    });
  }
}
