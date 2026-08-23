import { Component, inject } from '@angular/core';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseList {
  store = inject(CourseStore);
  auth = inject(AuthService);

  onDelete(id: number) {
    this.store.deleteCourse(id);
  }
}
