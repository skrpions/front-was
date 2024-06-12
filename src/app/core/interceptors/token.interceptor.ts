import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageApplication } from '../../routes/auth/application/storage-application';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storageApplication = inject(StorageApplication);
  const token = storageApplication.getField('token');

  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req);
};
