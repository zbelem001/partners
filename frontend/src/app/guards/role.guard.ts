import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const userRole = authService.getCurrentUserRole();
  const requiredRoles = route.data?.['roles'] as string[];

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    // If user is Admin but tries to go to workspace? 
    // Or User tries to go to Admin?
    
    // Redirect to their appropriate home
    if (userRole === 'Admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/workspace']);
    }
    return false;
  }

  return true;
};
