import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  async onSubmit() {
    if (this.form.invalid) return;
    this.errorMessage.set('');

    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login({ email: email!, password: password! });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err.error?.detail ?? 'Login failed.');
    }
  }
}
