import { ApplicationConfig, inject, provideZoneChangeDetection, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service';
import { SessionKeepaliveService } from './services/session-keepalive.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([credentialsInterceptor, errorInterceptor, jwtInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    // M12: silently restore a session from a persisted refresh token
    // before the app's first render, then start the keepalive timer so
    // an active session (mouse/keyboard activity within the last 15 min)
    // stays alive indefinitely, while a genuinely idle session expires.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      const keepalive = inject(SessionKeepaliveService);
      return auth.tryRestoreSession().then(() => keepalive.start());
    }),
  ],
};
