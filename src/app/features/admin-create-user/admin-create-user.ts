import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-create-user.html',
})
export class AdminCreateUser {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  roles = ['Student', 'Instructor', 'Admin'];

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    role: ['Instructor', [Validators.required]],
  });

  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { firstName, lastName, email, password, role } = this.form.getRawValue();

    try {
      const result = await this.auth.adminCreateUser({ firstName, lastName, email, password, role });
      this.successMessage.set(`${result.role} account created for ${result.email}.`);
      this.form.reset({ firstName: '', lastName: '', email: '', password: '', role: 'Instructor' });
    } catch (err: unknown) {
      const httpErr = err as { error?: { detail?: string; errors?: string[] } };
      if (httpErr?.error?.detail) {
        this.errorMessage.set(httpErr.error.detail);
      } else if (Array.isArray(httpErr?.error?.errors) && httpErr.error.errors.length) {
        this.errorMessage.set(httpErr.error.errors.join(' '));
      } else {
        this.errorMessage.set('Something went wrong creating the account. Please try again.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
