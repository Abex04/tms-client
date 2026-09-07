import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  async onSubmit() {
    if (this.form.invalid || this.isLoading()) return;
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    try {
      const { firstName, lastName, email, password } = this.form.getRawValue();
      await this.auth.register({
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
      });
      this.successMessage.set('Account created! Redirecting to sign in...');
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (err: any) {
      const errors = err.error?.errors;
      this.errorMessage.set(
        Array.isArray(errors) ? errors.join(' ') : (err.error?.detail ?? 'Registration failed.')
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
