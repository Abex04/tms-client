import { Component, inject } from '@angular/core';
import { CourseStore } from '../../store/course.store';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [],
  templateUrl: './course-catalog.html',
  styleUrl: './course-catalog.scss',
})
export class CourseCatalog {
  store = inject(CourseStore);

  onDelete(id: number) {
    this.store.deleteCourse(id);
  }
}
