import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  errorMessage = signal('');
  resetToken = signal('');
  isLoading = signal(false);

  async onSubmit() {
    if (this.form.invalid || this.isLoading()) return;
    this.errorMessage.set('');
    this.resetToken.set('');
    this.isLoading.set(true);

    try {
      const { email } = this.form.getRawValue();
      const res = await this.auth.forgotPassword(email!);
      // Demo mode: the token is shown directly since there's no email
      // service. In production this would be emailed, not displayed.
      this.resetToken.set(res.resetToken ?? '');
    } catch (err: any) {
      this.errorMessage.set(err.error?.detail ?? 'Something went wrong. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
