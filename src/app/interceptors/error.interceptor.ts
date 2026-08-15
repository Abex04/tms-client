import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Central error handler - every HTTP error in the app flows through here
// exactly once, instead of every component writing its own error handling.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // .NET's RFC 7807 ProblemDetails puts the human-readable message in
      // `detail` - fall back to a generic message if the server didn't
      // send a ProblemDetails body (e.g. a network failure with no body at all).
      const detailMessage = err.error?.detail ?? 'A system error occurred. Please try again.';

      if (err.status === 401) {
        // Expired or missing session - send the user back to login rather
        // than showing a confusing error on whatever page they were on.
        router.navigate(['/login']);
      } else {
        console.error('API Error Response:', detailMessage);
      }

      // Rethrow so downstream subscribers (e.g. optimistic rollback logic
      // in a store's catchError) still see the error and can react to it.
      return throwError(() => err);
    })
  );
};
