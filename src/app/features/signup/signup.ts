import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

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
    password: ['', [Validators.required, Validators.minLength(12), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
    confirmPassword: ['', Validators.required],
    agreeToTerms: [false, Validators.requiredTrue],
  }, { validators: passwordsMatchValidator });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  private passwordValue = signal('');

  passwordStrength = computed<PasswordStrength>(() => {
    const value = this.passwordValue();
    if (!value) return 'empty';

    let score = 0;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (value.length >= 16) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  });

  constructor() {
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.passwordValue.set(value ?? '');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

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
