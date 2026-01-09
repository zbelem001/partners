import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConventionsService } from '../../../services/conventions.service';
import { PartnersService } from '../../../services/partners.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionsService, Permission } from '../../../services/permissions.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

interface Convention {
  id: string;
  ref: string;
  partnerId: string;
  partnerName?: string;
  type: string;
  status: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-my-conventions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HasPermissionDirective],
  template: `
    <div class="my-conventions-page">
      <div class="page-header">
        <div class="title-section">
          <h1>Mes Conventions</h1>
          <p class="subtitle">Conventions dont vous êtes responsable</p>
        </div>
        
        <button 
          *appHasPermission="[Permission.CREATE_CONVENTION]"
          class="btn-create"
          routerLink="/workspace/conventions/create"
        >
          + Nouvelle Convention
        </button>
      </div>

      <!-- FILTERS -->
      <div class="filters-bar">
        <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="Draft">Brouillon</option>
          <option value="Active">Active</option>
          <option value="Signed">Signée</option>
          <option value="Ended">Terminée</option>
        </select>

        <select [(ngModel)]="sortBy" (change)="applySorting()" class="filter-select">
          <option value="date_desc">Plus récentes</option>
          <option value="date_asc">Plus anciennes</option>
          <option value="progress_desc">Progression ↓</option>
          <option value="progress_asc">Progression ↑</option>
          <option value="deadline">Échéance proche</option>
        </select>
      </div>

      <!-- STATS SUMMARY -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ totalConventions }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item active">
          <span class="stat-value">{{ activeConventions }}</span>
          <span class="stat-label">Actives</span>
        </div>
        <div class="stat-item warning">
          <span class="stat-value">{{ draftConventions }}</span>
          <span class="stat-label">Brouillons</span>
        </div>
        <div class="stat-item success">
          <span class="stat-value">{{ avgProgress }}%</span>
          <span class="stat-label">Progression moyenne</span>
        </div>
      </div>

      <!-- CONVENTIONS LIST -->
      <div class="conventions-list" *ngIf="filteredConventions.length > 0; else noConventions">
        <div 
          *ngFor="let convention of filteredConventions" 
          class="convention-card"
        >
          <div class="card-main" [routerLink]="['/workspace/conventions', convention.id]">
            <div class="card-header">
              <div class="ref-section">
                <span class="ref-code">{{ convention.ref }}</span>
                <span class="partner-name" *ngIf="convention.partnerName">
                  {{ convention.partnerName }}
                </span>
              </div>
              
              <span class="status-badge" [ngClass]="getStatusClass(convention.status)">
                {{ convention.status }}
              </span>
            </div>

            <div class="card-body">
              <div class="type-label">{{ convention.type }}</div>
              
              <div class="dates-row">
                <span class="date-info">
                  Du {{ convention.startDate | date: 'dd/MM/yyyy' }} 
                  au {{ convention.endDate | date: 'dd/MM/yyyy' }}
                </span>
                <span class="days-left" [ngClass]="getDaysLeftClass(convention.endDate)">
                  {{ getDaysLeft(convention.endDate) }}
                </span>
              </div>

              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="convention.progress"></div>
                </div>
                <span class="progress-text">{{ convention.progress }}%</span>
              </div>
            </div>
          </div>

          <div class="card-actions" *appHasPermission="[Permission.UPDATE_MY_CONVENTIONS]">
            <button 
              class="btn-action btn-edit"
              [routerLink]="['/workspace/conventions', convention.id, 'edit']"
            >
              Modifier
            </button>
            <button 
              class="btn-action btn-update"
              (click)="updateProgress(convention)"
            >
              Mettre à jour
            </button>
          </div>
        </div>
      </div>

      <ng-template #noConventions>
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>Aucune convention assignée</h3>
          <p>Vous n'avez pas encore de conventions dont vous êtes responsable.</p>
          <button 
            *appHasPermission="[Permission.CREATE_CONVENTION]"
            class="btn-create-empty"
            routerLink="/workspace/conventions/create"
          >
            Créer une convention
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .my-conventions-page {
      padding: 1rem 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      .title-section {
        h1 { margin: 0; font-size: 1.8rem; color: #2c3e50; }
        .subtitle { margin: 0.5rem 0 0 0; color: #7f8c8d; }
      }

      .btn-create {
        background: #003566;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;

        &:hover { background: #00509d; }
      }
    }

    .filters-bar {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e1e8ed;
      border-radius: 6px;
      background: white;
      font-size: 0.9rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #003566;
      }
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      background: white;
      padding: 1.25rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border-left: 4px solid #95a5a6;

      &.active { border-left-color: #27ae60; }
      &.warning { border-left-color: #f39c12; }
      &.success { border-left-color: #3498db; }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #2c3e50;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.85rem;
        color: #7f8c8d;
        margin-top: 0.5rem;
      }
    }

    .conventions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .convention-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;
      overflow: hidden;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      }
    }

    .card-main {
      padding: 1.5rem;
      cursor: pointer;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      .ref-section {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .ref-code {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          font-family: monospace;
        }

        .partner-name {
          font-size: 0.9rem;
          color: #7f8c8d;
        }
      }

      .status-badge {
        padding: 0.4rem 1rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;

        &.draft { background: #f0f3f4; color: #5d6d7e; }
        &.active { background: #d4edda; color: #155724; }
        &.signed { background: #cce5ff; color: #004085; }
        &.ended { background: #f8d7da; color: #721c24; }
      }
    }

    .card-body {
      .type-label {
        font-size: 0.85rem;
        color: #95a5a6;
        margin-bottom: 0.75rem;
      }

      .dates-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .date-info {
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .days-left {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;

          &.urgent { background: #ffe5e5; color: #c0392b; }
          &.warning { background: #fff3cd; color: #856404; }
          &.ok { background: #d4edda; color: #155724; }
        }
      }

      .progress-section {
        display: flex;
        align-items: center;
        gap: 1rem;

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #ecf0f1;
          border-radius: 4px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #27ae60, #2ecc71);
            transition: width 0.3s;
          }
        }

        .progress-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #27ae60;
          min-width: 45px;
        }
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #eef2f6;

      .btn-action {
        flex: 1;
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &.btn-edit {
          background: white;
          color: #003566;
          border: 1px solid #003566;

          &:hover { background: #003566; color: white; }
        }

        &.btn-update {
          background: #27ae60;
          color: white;

          &:hover { background: #229954; }
        }
      }
    }

    .empty-state {
      background: white;
      padding: 4rem 2rem;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      p {
        color: #7f8c8d;
        margin-bottom: 1.5rem;
      }

      .btn-create-empty {
        background: #003566;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 0.95rem;
        cursor: pointer;

        &:hover { background: #00509d; }
      }
    }
  `]
})
export class MyConventionsComponent implements OnInit {
  Permission = Permission;
  
  conventions: Convention[] = [];
  filteredConventions: Convention[] = [];
  
  filterStatus: string = '';
  sortBy: string = 'date_desc';
  
  totalConventions = 0;
  activeConventions = 0;
  draftConventions = 0;
  avgProgress = 0;

  constructor(
    private conventionsService: ConventionsService,
    private partnersService: PartnersService,
    private authService: AuthService,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    this.loadMyConventions();
  }

  loadMyConventions() {
    // Load user's assigned conventions from API
    this.conventionsService.findMyConventions().subscribe({
      next: (data) => {
        this.conventions = data;
        this.loadPartnerNames();
        this.calculateStats();
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement conventions:', err)
    });
  }

  loadPartnerNames() {
    const partnerIds = [...new Set(this.conventions.map(c => c.partnerId))];
    
    partnerIds.forEach(id => {
      this.partnersService.findOne(id).subscribe({
        next: (partner) => {
          this.conventions.forEach(conv => {
            if (conv.partnerId === id) {
              conv.partnerName = partner.name;
            }
          });
        },
        error: (err) => console.error('Erreur chargement partenaire:', err)
      });
    });
  }

  calculateStats() {
    this.totalConventions = this.conventions.length;
    this.activeConventions = this.conventions.filter(c => c.status === 'Active').length;
    this.draftConventions = this.conventions.filter(c => c.status === 'Draft').length;
    
    if (this.conventions.length > 0) {
      const totalProgress = this.conventions.reduce((sum, c) => sum + (c.progress || 0), 0);
      this.avgProgress = Math.round(totalProgress / this.conventions.length);
    }
  }

  applyFilters() {
    this.filteredConventions = this.conventions.filter(conv => {
      return !this.filterStatus || conv.status === this.filterStatus;
    });
    
    this.applySorting();
  }

  applySorting() {
    switch(this.sortBy) {
      case 'date_desc':
        this.filteredConventions.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        break;
      case 'date_asc':
        this.filteredConventions.sort((a, b) => 
          new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
        );
        break;
      case 'progress_desc':
        this.filteredConventions.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'progress_asc':
        this.filteredConventions.sort((a, b) => (a.progress || 0) - (b.progress || 0));
        break;
      case 'deadline':
        this.filteredConventions.sort((a, b) => 
          new Date(a.endDate || '').getTime() - new Date(b.endDate || '').getTime()
        );
        break;
    }
  }

  getDaysLeft(endDate?: string): string {
    if (!endDate) return 'Date non définie';
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expiré';
    if (diffDays === 0) return 'Expire aujourd\'hui';
    if (diffDays === 1) return 'Expire demain';
    return `${diffDays} jours restants`;
  }

  getDaysLeftClass(endDate?: string): string {
    if (!endDate) return 'unknown';
    const end = new Date(endDate);
    const today = new Date();
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays <= 7) return 'urgent';
    if (diffDays <= 30) return 'warning';
    return 'ok';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Draft': 'draft',
      'Active': 'active',
      'Signed': 'signed',
      'Ended': 'ended'
    };
    return statusMap[status] || 'draft';
  }

  updateProgress(convention: Convention) {
    // TODO: Ouvrir modal de mise à jour progression
    console.log('Update progress:', convention.ref);
  }
}
