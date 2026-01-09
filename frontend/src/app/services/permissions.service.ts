import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export enum Permission {
  // CONSULTATION
  VIEW_PARTNERS = 'view_partners',
  VIEW_CONVENTIONS = 'view_conventions',
  VIEW_DOCUMENTS = 'view_documents',
  VIEW_MY_TASKS = 'view_my_tasks',
  VIEW_MY_CONVENTIONS = 'view_my_conventions',
  
  // GESTION PROPRE
  UPDATE_MY_CONVENTIONS = 'update_my_conventions',
  ADD_DOCUMENTS = 'add_documents',
  ADD_MEETING_NOTES = 'add_meeting_notes',
  UPDATE_PROGRESS = 'update_progress',
  
  // CRÉATION
  CREATE_CONVENTION = 'create_convention',
  ASSIGN_RESPONSIBLE = 'assign_responsible',
  
  // VALIDATION
  VALIDATE_ADMINISTRATIVE = 'validate_administrative',
  VALIDATE_FINANCIAL = 'validate_financial',
  VALIDATE_QUALITY = 'validate_quality',
  SIGN_CONVENTION = 'sign_convention',
  
  // ADMINISTRATION
  MANAGE_PARTNERS = 'manage_partners',
  MANAGE_USERS = 'manage_users',
  MANAGE_SYSTEM = 'manage_system',
  VIEW_ALL_REPORTS = 'view_all_reports',
  MANAGE_CONVENTIONS = 'manage_conventions',
  
  // ÉQUIPE
  VIEW_TEAM_ACTIVITY = 'view_team_activity',
  REASSIGN_CONVENTIONS = 'reassign_conventions'
}

interface RolePermissions {
  [key: string]: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  
  private rolePermissions: RolePermissions = {
    // UTILISATEUR STANDARD
    'User': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VIEW_MY_CONVENTIONS
    ],
    
    // RESPONSABLE DE SUIVI (hérite de User)
    'Responsible': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VIEW_MY_CONVENTIONS,
      Permission.UPDATE_MY_CONVENTIONS,
      Permission.ADD_DOCUMENTS,
      Permission.ADD_MEETING_NOTES,
      Permission.UPDATE_PROGRESS
    ],
    
    // MANAGER / DIRECTION
    'Manager': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VIEW_MY_CONVENTIONS,
      Permission.UPDATE_MY_CONVENTIONS,
      Permission.ADD_DOCUMENTS,
      Permission.ADD_MEETING_NOTES,
      Permission.UPDATE_PROGRESS,
      Permission.CREATE_CONVENTION,
      Permission.ASSIGN_RESPONSIBLE,
      Permission.VIEW_TEAM_ACTIVITY,
      Permission.REASSIGN_CONVENTIONS
    ],
    
    'Direction': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VIEW_MY_CONVENTIONS,
      Permission.UPDATE_MY_CONVENTIONS,
      Permission.ADD_DOCUMENTS,
      Permission.ADD_MEETING_NOTES,
      Permission.UPDATE_PROGRESS,
      Permission.CREATE_CONVENTION,
      Permission.ASSIGN_RESPONSIBLE,
      Permission.VIEW_TEAM_ACTIVITY,
      Permission.REASSIGN_CONVENTIONS
    ],
    
    // VALIDATEURS SPÉCIALISÉS
    'SRECIP': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VALIDATE_ADMINISTRATIVE
    ],
    
    'DFC': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VALIDATE_FINANCIAL
    ],
    
    'CAQ': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VALIDATE_QUALITY
    ],
    
    // SIGNATAIRE DG
    'DG': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.SIGN_CONVENTION,
      Permission.VIEW_ALL_REPORTS
    ],
    
    // ADMIN RECIP (tous les droits)
    'Admin': [
      Permission.VIEW_PARTNERS,
      Permission.VIEW_CONVENTIONS,
      Permission.VIEW_DOCUMENTS,
      Permission.VIEW_MY_TASKS,
      Permission.VIEW_MY_CONVENTIONS,
      Permission.UPDATE_MY_CONVENTIONS,
      Permission.ADD_DOCUMENTS,
      Permission.ADD_MEETING_NOTES,
      Permission.UPDATE_PROGRESS,
      Permission.CREATE_CONVENTION,
      Permission.ASSIGN_RESPONSIBLE,
      Permission.VALIDATE_ADMINISTRATIVE,
      Permission.VALIDATE_FINANCIAL,
      Permission.VALIDATE_QUALITY,
      Permission.SIGN_CONVENTION,
      Permission.MANAGE_PARTNERS,
      Permission.MANAGE_USERS,
      Permission.MANAGE_SYSTEM,
      Permission.VIEW_ALL_REPORTS,
      Permission.MANAGE_CONVENTIONS,
      Permission.VIEW_TEAM_ACTIVITY,
      Permission.REASSIGN_CONVENTIONS
    ]
  };

  constructor(private authService: AuthService) {}

  /**
   * Vérifie si l'utilisateur actuel a une permission spécifique
   */
  hasPermission(permission: Permission): boolean {
    const userRole = this.authService.getCurrentUserRole();
    if (!userRole) return false;

    const permissions = this.rolePermissions[userRole];
    return permissions ? permissions.includes(permission) : false;
  }

  /**
   * Vérifie si l'utilisateur a au moins une des permissions listées
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Vérifie si l'utilisateur a toutes les permissions listées
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Retourne toutes les permissions de l'utilisateur actuel
   */
  getUserPermissions(): Permission[] {
    const userRole = this.authService.getCurrentUserRole();
    if (!userRole) return [];
    
    return this.rolePermissions[userRole] || [];
  }

  /**
   * Vérifie si l'utilisateur peut modifier une convention
   */
  canEditConvention(conventionOwnerId?: number): boolean {
    const currentUserId = this.getCurrentUserId();
    
    // Admin peut tout modifier
    if (this.hasPermission(Permission.MANAGE_CONVENTIONS)) {
      return true;
    }

    // Manager/Direction peuvent modifier les conventions de leur équipe
    if (this.hasPermission(Permission.REASSIGN_CONVENTIONS)) {
      return true;
    }

    // Responsable peut modifier ses propres conventions
    if (this.hasPermission(Permission.UPDATE_MY_CONVENTIONS)) {
      return conventionOwnerId === currentUserId;
    }

    return false;
  }

  /**
   * Vérifie si l'utilisateur peut créer des conventions
   */
  canCreateConvention(): boolean {
    return this.hasPermission(Permission.CREATE_CONVENTION);
  }

  /**
   * Vérifie si l'utilisateur peut valider (SRECIP, DFC, CAQ, DG)
   */
  canValidate(): boolean {
    return this.hasAnyPermission([
      Permission.VALIDATE_ADMINISTRATIVE,
      Permission.VALIDATE_FINANCIAL,
      Permission.VALIDATE_QUALITY,
      Permission.SIGN_CONVENTION
    ]);
  }

  /**
   * Vérifie si l'utilisateur est un administrateur
   */
  isAdmin(): boolean {
    return this.hasPermission(Permission.MANAGE_SYSTEM);
  }

  /**
   * Récupère l'ID de l'utilisateur actuel
   */
  private getCurrentUserId(): number | null {
    const userId = sessionStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Vérifie si l'utilisateur peut accéder à l'admin
   */
  canAccessAdmin(): boolean {
    return this.authService.getCurrentUserRole() === 'Admin';
  }

  /**
   * Vérifie si l'utilisateur peut accéder au workspace
   */
  canAccessWorkspace(): boolean {
    const role = this.authService.getCurrentUserRole();
    return ['User', 'Responsible', 'Manager', 'Direction', 'SRECIP', 'DFC', 'CAQ', 'DG'].includes(role || '');
  }
}
