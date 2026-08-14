import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
  displayName: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Session state lives here as a signal, not a raw token - the token
  // itself never touches JavaScript at all, since it's in an HttpOnly
  // cookie the browser manages automatically.
  currentUser = signal<TmsUser | null>(null);

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginCredentials) {
    // Server sets the HttpOnly auth cookie via the Set-Cookie response
    // header - we never read or store the token ourselves.
    await firstValueFrom(
      this.http.post<void>('/api/v2/auth/login', credentials)
    );

    // Browser automatically attaches the cookie on this next request -
    // no token to manually pass along.
    const user = await firstValueFrom(
      this.http.get<TmsUser>('/api/v2/auth/me')
    );
    this.currentUser.set(user);
  }
}
