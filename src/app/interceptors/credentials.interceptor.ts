import { HttpInterceptorFn } from '@angular/common/http';

// Angular's HttpClient omits cookies on cross-origin requests by default.
// This interceptor forces withCredentials: true on every outgoing request,
// so the browser attaches the tms_auth HttpOnly cookie automatically.
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
