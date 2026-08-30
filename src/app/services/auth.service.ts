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

const REFRESH_TOKEN_KEY = 'tms_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

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

  // Called once at app startup - silently restores a session from a
  // persisted refresh token instead of forcing /login on every page refresh.
  async tryRestoreSession(): Promise<void> {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) return;
    await this.refreshAccessToken(storedRefreshToken);
  }

  // Shared refresh logic - used by tryRestoreSession() at startup and by
  // SessionKeepaliveService while the user is actively using the app.
  // Rotation means each call both extends AND replaces the stored
  // refresh token - reusing an old one after this would trigger the
  // backend's theft-detection and revoke every session for this user.
  async refreshAccessToken(tokenOverride?: string): Promise<void> {
    const tokenToUse = tokenOverride ?? localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!tokenToUse) throw new Error('No refresh token available.');

    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/v2/auth/refresh', {
          refreshToken: tokenToUse,
        })
      );
      this.setSessionFromResponse(res);
    } catch (err) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      throw err;
    }
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
