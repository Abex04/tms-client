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

// localStorage key for the refresh token. Note: the refresh token was
// already delivered to the browser as plain JSON on login - storing it
// in memory only never actually hid it from an XSS payload running
// during that session. Persisting it here just means it survives a
// page refresh too, which is what lets tryRestoreSession() silently
// re-authenticate instead of forcing a full re-login every refresh.
const REFRESH_TOKEN_KEY = 'tms_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // The short-lived (15 min) access token stays in memory only - never
  // persisted. This is what an XSS payload would need to steal to
  // impersonate an active session, and it's gone the moment the tab
  // closes or refreshes, unlike the refresh token.
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  private setSessionFromResponse(res: AuthResponse): void {
    this.accessToken.set(res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

    const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
    this.currentUser.set({
      email: payload.email,
      displayName: payload.FirstName || payload.email || 'User',
      role: payload.role || 'Student',
    });
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/v2/auth/login', credentials)
    );
    this.setSessionFromResponse(res);
  }

  // Called once at app startup (see app.config.ts's provideAppInitializer).
  // If a refresh token survived from a previous session, silently trade
  // it for a new access token instead of forcing the user back to
  // /login on every page refresh. Fails silently - an expired/invalid
  // refresh token just means the user stays logged out, same as if
  // they'd never had a session.
  async tryRestoreSession(): Promise<void> {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) return;

    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/v2/auth/refresh', {
          refreshToken: storedRefreshToken,
        })
      );
      this.setSessionFromResponse(res);
    } catch {
      // Refresh token expired, revoked, or already used - clear it so
      // we don't keep retrying a dead token on every future load.
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
