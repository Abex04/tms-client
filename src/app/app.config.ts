import { ApplicationConfig, inject, provideZoneChangeDetection, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service';

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
    // before the app's first render, so a page refresh doesn't force
    // the user back to /login unless their refresh token has actually
    // expired or been revoked.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.tryRestoreSession();
    }),
  ],
};
