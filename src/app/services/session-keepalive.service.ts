import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const CHECK_INTERVAL_MS = 60 * 1000;    // check every minute
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000; // matches Jwt:ExpiryMinutes

// M12: keeps an active admin's session alive indefinitely, while letting
// a genuinely idle session expire after 15 minutes - a sliding-expiration
// pattern. Mouse/keyboard activity resets the idle clock; a background
// timer silently refreshes the access token (extending the session)
// only if the user has been active recently. If they've walked away,
// we simply stop refreshing and the token expires naturally.
@Injectable({
  providedIn: 'root',
})
export class SessionKeepaliveService {
  private auth = inject(AuthService);
  private lastActivityAt = signal(Date.now());
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.intervalHandle) return; // already running

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'click'];
    const onActivity = () => this.lastActivityAt.set(Date.now());
    activityEvents.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));

    // Refresh a couple minutes before the access token actually expires,
    // so an in-flight request never gets caught mid-expiry.
    const refreshBufferMs = 2 * 60 * 1000;

    this.intervalHandle = setInterval(() => {
      const idleFor = Date.now() - this.lastActivityAt();
      if (idleFor < IDLE_TIMEOUT_MS) {
        // Still active within the last 15 minutes - extend the session.
        this.auth.refreshAccessToken().catch(() => {
          // Refresh token itself expired/revoked - nothing more to do,
          // the user will be redirected to /login on their next action.
        });
      }
      // If idle >= 15 minutes, do nothing - let the access token expire
      // naturally. This is the actual "log out after inactivity" behavior.
    }, CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }
}
