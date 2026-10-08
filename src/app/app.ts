import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { StudentsService } from './services/students.service';
import { StudentNotifications } from './services/student-notifications';
import { ToastContainerComponent } from './ui/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tms-client');

  private auth = inject(AuthService);
  private studentsApi = inject(StudentsService);
  private studentNotifications = inject(StudentNotifications);

  constructor() {
    // Whenever the logged-in user is a Student, start listening for live
    // enrollment status updates so they get a toast the moment an
    // instructor approves/rejects them - works on any page, since this
    // lives on the root component rather than one specific route.
    effect(() => {
      const user = this.auth.currentUser();
      if (user?.role === 'Student') {
        this.studentsApi.getMe()
          .then((student) => this.studentNotifications.initialize(student.id))
          .catch(() => {});
      }
    });
  }
}
