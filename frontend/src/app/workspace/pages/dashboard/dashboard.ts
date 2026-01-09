import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionsService, Permission } from '../../../services/permissions.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-workspace-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-grid">
      <!-- WELCOME SECTION -->
      <section class="welcome-card full-width">
        <h2>Bienvenue sur votre espace</h2>
        <p>Gérez vos conventions, suivez vos tâches et consultez l'annuaire des partenaires.</p>
      </section>

      <!-- STATS CARDS -->
      <div class="stat-card">
        <div class="icon-bg blue"></div>
        <div class="stat-info">
          <span class="value">4</span>
          <span class="label">Conventions Actives</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon-bg orange"></div>
        <div class="stat-info">
          <span class="value">2</span>
          <span class="label">Actions en attente</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon-bg green"></div>
        <div class="stat-info">
          <span class="value">12</span>
          <span class="label">Tâches terminées</span>
        </div>
      </div>

      <!-- RECENT ACTIVITY / TASKS -->
      <section class="content-card full-width">
        <div class="card-header">
          <h3>Mes Tâches Récentes</h3>
          <a routerLink="/workspace/my-conventions" class="btn-link">Voir mes conventions</a>
        </div>
        <div class="task-list">
          <div class="task-item">
            <div class="task-status pending"></div>
            <div class="task-details">
              <span class="task-title">Valider la convention Bolloré</span>
              <span class="task-meta">Assigné le 12 Oct • Échéance: 15 Oct</span>
            </div>
            <button class="btn-action">Traiter</button>
          </div>
          
          <div class="task-item">
            <div class="task-status done"></div>
            <div class="task-details">
              <span class="task-title">Mise à jour fiche partenaire TotalEnergies</span>
              <span class="task-meta">Terminé le 10 Oct</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    /* CARDS COMMON */
    .welcome-card, .stat-card, .content-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;
    }

    /* WELCOME */
    .welcome-card {
      padding: 2rem;
      background: linear-gradient(135deg, #003566 0%, #00509d 100%);
      color: white;
      
      h2 { margin: 0 0 0.5rem 0; font-size: 1.8rem; }
      p { margin: 0; opacity: 0.9; }
    }

    /* STATS */
    .stat-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .icon-bg {
        width: 50px; height: 50px;
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
        
        &.blue { background: #e3f2fd; color: #1976d2; }
        &.orange { background: #fff3e0; color: #f57c00; }
        &.green { background: #e8f5e9; color: #388e3c; }
      }

      .stat-info {
        display: flex; flex-direction: column;
        .value { font-size: 1.8rem; font-weight: 700; color: #2c3e50; }
        .label { font-size: 0.9rem; color: #7f8c8d; }
      }
    }

    /* TASKS LIST */
    .content-card {
      padding: 1.5rem;

      .card-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 1.5rem;
        h3 { margin: 0; font-size: 1.1rem; color: #2c3e50; }
        .btn-link { background: none; border: none; color: #3498db; cursor: pointer; }
      }

      .task-list {
        display: flex; flex-direction: column; gap: 1rem;
      }

      .task-item {
        display: flex; align-items: center; gap: 1rem;
        padding: 1rem;
        border: 1px solid #f1f3f4;
        border-radius: 8px;
        transition: transform 0.2s;

        &:hover { transform: translateX(5px); background: #fafafa; }

        .task-status {
          width: 12px; height: 12px; border-radius: 50%;
          &.pending { background: #ff9800; }
          &.done { background: #4caf50; }
        }

        .task-details {
          flex: 1;
          display: flex; flex-direction: column;
          .task-title { font-weight: 500; color: #2c3e50; }
          .task-meta { font-size: 0.8rem; color: #95a5a6; }
        }

        .btn-action {
          padding: 6px 16px;
          background: #003566; color: white;
          border: none; border-radius: 6px;
          font-size: 0.85rem; cursor: pointer;
        }
      }
    }
  `]
})
export class WorkspaceDashboardComponent {
  Permission = Permission; // Expose enum au template
  
  constructor(public permissionsService: PermissionsService) {}
}
