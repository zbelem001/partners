import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Needed for *ngIf
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}

  canAccess(roles: string[]): boolean {
    const userRole = this.authService.getCurrentUserRole() || '';
    return roles.includes(userRole);
  }

  // Helper for 'Only Admin'
  get isAdmin(): boolean {
    return this.authService.getCurrentUserRole() === 'Admin';
  }

  // Helper for 'Managers/Direction'
  get isManagerOrAbove(): boolean {
    return ['Admin', 'Manager', 'Direction'].includes(this.authService.getCurrentUserRole() || '');
  }
}
