import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // M11 Session 3: the JWT access token now lives here, in memory only -
  // never in localStorage, so an XSS payload reading localStorage can't
  // steal it. It's lost on page refresh by design (short 15-min expiry
  // means the app should re-login or use the refresh token, not persist
  // this long-term).
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/v2/auth/login', credentials)
    );
    this.accessToken.set(res.accessToken);

    // Decode the JWT payload directly - our TokenService uses literal
    // short claim names (sub, email, role, FirstName), not the long
    // schema URIs .NET uses by default, so no fallback chain needed here.
    const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
    this.currentUser.set({
      email: payload.email,
      displayName: payload.FirstName || payload.email || 'User',
      role: payload.role || 'Student',
    });
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }
}
