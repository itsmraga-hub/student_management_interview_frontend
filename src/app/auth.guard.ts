// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Use the AuthService
  const router = inject(Router); // Use the Router

  if (authService.validateToken()) {
    return true; // Allow access if the token is valid
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
