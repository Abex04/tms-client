import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage = signal('');
  isLoading = signal(false);

  async onSubmit() {
    if (this.form.invalid || this.isLoading()) return;
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login({ email: email!, password: password! });

      // Route based on role: Students land on their own dashboard,
      // Instructors/Admins land on the Instructor Command Center.
      const role = this.auth.currentUser()?.role;
      if (role === 'Student') {
        this.router.navigate(['/student-dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.errorMessage.set(err.error?.detail ?? 'Login failed.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
