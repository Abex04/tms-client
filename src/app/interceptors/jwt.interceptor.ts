import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Attaches the in-memory JWT access token as an Authorization: Bearer
// header on every outgoing request. This is separate from
// credentialsInterceptor (M10) - that one handles the tms_auth cookie
// transport; this one handles the new JWT transport. Both can run
// together without conflict.
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
