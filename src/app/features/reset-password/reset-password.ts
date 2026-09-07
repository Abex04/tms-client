import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(12), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
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
      const { email, token, newPassword } = this.form.getRawValue();
      await this.auth.resetPassword(email!, token!, newPassword!);
      this.successMessage.set('Password reset! Redirecting to sign in...');
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (err: any) {
      const errors = err.error?.errors;
      this.errorMessage.set(
        Array.isArray(errors) ? errors.join(' ') : (err.error?.detail ?? 'Reset failed. Check your code and try again.')
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
