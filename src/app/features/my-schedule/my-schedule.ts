import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrollmentService, ScheduleItem } from '../../services/enrollment.service';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-schedule.html',
})
export class MySchedule {
  private enrollmentApi = inject(EnrollmentService);
  private studentsApi = inject(StudentsService);

  courses = signal<ScheduleItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor() {
    this.loadSchedule();
  }

  private async loadSchedule() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const student = await this.studentsApi.getMe();
      const schedule = await this.enrollmentApi.getSchedule(student.id);
      this.courses.set(schedule.courses);
    } catch {
      this.errorMessage.set('Could not load your schedule. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
