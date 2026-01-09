import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PermissionsService, Permission } from '../../../services/permissions.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './workspace-layout.html',
  styleUrls: ['./workspace-layout.scss']
})
export class WorkspaceLayoutComponent {
  Permission = Permission; // Expose enum au template
  
  constructor(
    public authService: AuthService,
    public permissionsService: PermissionsService
  ) {}

  isValidator(): boolean {
    const role = this.authService.getCurrentUserRole();
    return role ? ['SRECIP', 'DFC', 'CAQ', 'DG'].includes(role) : false;
  }
}
