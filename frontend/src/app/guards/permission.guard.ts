import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { PermissionsService, Permission } from '../services/permissions.service';

/**
 * Guard pour vérifier les permissions spécifiques
 * Utilisation: canActivate: [permissionGuard], data: { permissions: [Permission.CREATE_CONVENTION] }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);
  
  const requiredPermissions = route.data?.['permissions'] as Permission[];
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // Aucune permission requise
  }

  // Vérifie si l'utilisateur a au moins une des permissions requises
  const hasPermission = permissionsService.hasAnyPermission(requiredPermissions);

  if (!hasPermission) {
    // Redirection vers une page d'erreur ou le dashboard approprié
    const canAccessAdmin = permissionsService.canAccessAdmin();
    const canAccessWorkspace = permissionsService.canAccessWorkspace();

    if (canAccessAdmin) {
      router.navigate(['/admin/dashboard']);
    } else if (canAccessWorkspace) {
      router.navigate(['/workspace/dashboard']);
    } else {
      router.navigate(['/login']);
    }
    
    return false;
  }

  return true;
};
