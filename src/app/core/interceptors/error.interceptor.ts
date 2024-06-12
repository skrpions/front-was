import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if ([404].includes(err.status)) {
        console.log('Not Found');
        router.navigate(['/dashboard/home']);
        // router.navigate(['/404']);
      }

      const e = err.error.message || err.statusText;
      console.error(e);
      return throwError(() => err);
    })
  );
};
