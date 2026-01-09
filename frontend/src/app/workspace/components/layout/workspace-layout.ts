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
  template: `
    <div class="workspace-container">
      <!-- TOP NAVIGATION BAR (Different from Admin Sidebar) -->
      <header class="workspace-header">
        <div class="brand">
          <span class="logo-text">2iE <span class="highlight">Espace Collaboratif</span></span>
        </div>
        
        <nav class="top-nav">
          <a routerLink="/workspace/dashboard" routerLinkActive="active">
            Mon Tableau de bord
          </a>
          <a routerLink="/workspace/my-conventions" routerLinkActive="active">
            Mes Conventions
          </a>
          <a routerLink="/workspace/conventions" routerLinkActive="active">
            Toutes les Conventions
          </a>
          <a routerLink="/workspace/partners" routerLinkActive="active">
            Annuaire
          </a>
          <a routerLink="/workspace/tasks" routerLinkActive="active">
            Tâches
          </a>
        </nav>

        <div class="user-profile">
          <div class="info">
            <span class="name">{{ authService.getUserName() }}</span>
            <span class="role">{{ authService.getCurrentUserRole() }}</span>
          </div>
          <button (click)="authService.logout()" class="btn-logout" title="Déconnexion">⏻</button>
        </div>
      </header>

      <!-- MAIN CONTENT AREA -->
      <main class="workspace-content">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .workspace-container {
      min-height: 100vh;
      background-color: #f4f6f8;
      font-family: 'Segoe UI', sans-serif;
    }

    .workspace-header {
      background: white;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      
      .brand .logo-text {
        font-weight: 700;
        font-size: 1.2rem;
        color: #003566;
        .highlight { color: #ff5400; }
      }

      .top-nav {
        display: flex;
        gap: 2rem;
        
        a {
          text-decoration: none;
          color: #5d7a8c;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 1.2rem 0;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;

          &:hover, &.active {
            color: #003566;
            border-bottom-color: #ff5400;
          }
        }
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 1rem;

        .info {
          text-align: right;
          line-height: 1.2;
          .name { display: block; font-weight: 600; font-size: 0.9rem; color: #003566; }
          .role { display: block; font-size: 0.75rem; color: #888; }
        }

        .btn-logout {
          background: #ffebee;
          color: #d32f2f;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: background 0.2s;

          &:hover { background: #ffcdd2; }
        }
      }
    }

    .workspace-content {
      padding: 2rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  `]
})
export class WorkspaceLayoutComponent {
  Permission = Permission; // Expose enum au template
  
  constructor(
    public authService: AuthService,
    public permissionsService: PermissionsService
  ) {}
}
