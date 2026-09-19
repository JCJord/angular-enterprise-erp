import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components';
import { resolveHttpErrorMessage, SKIP_ERROR_TOAST } from './http-error-map';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const skipToast = req.context.get(SKIP_ERROR_TOAST);

      if (!skipToast) {
        const rawServerMessage = error?.error?.message;
        const resolved = resolveHttpErrorMessage(req.url, error.status, rawServerMessage);

        toastService.error(resolved.message, {
          title: resolved.title
        });
      }

      return throwError(() => error);
    })
  );
};
