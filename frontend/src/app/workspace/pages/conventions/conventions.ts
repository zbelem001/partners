import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConventionsService } from '../../../services/conventions.service';

interface Convention {
  id: string;
  ref: string;
  partnerId: string;
  type: string;
  status: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-workspace-conventions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="conventions-page">
      <div class="page-header">
        <h1>Conventions</h1>
        <p class="subtitle">Consultez l'ensemble des conventions de partenariat</p>
      </div>

      <!-- FILTERS -->
      <div class="filters-bar">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Rechercher par référence..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="Draft">Brouillon</option>
            <option value="Active">Active</option>
            <option value="Signed">Signée</option>
            <option value="Ended">Terminée</option>
          </select>

          <select [(ngModel)]="filterType" (change)="applyFilters()" class="filter-select">
            <option value="">Tous les types</option>
            <option value="Accord Cadre">Accord Cadre</option>
            <option value="Convention Spécifique">Convention Spécifique</option>
            <option value="Avenant">Avenant</option>
          </select>
        </div>
      </div>

      <!-- RESULTS -->
      <div class="results-info">
        <span class="count">{{ filteredConventions.length }} convention(s) trouvée(s)</span>
        <button *ngIf="hasActiveFilters()" (click)="clearFilters()" class="btn-clear">
          Réinitialiser
        </button>
      </div>

      <!-- CONVENTIONS LIST -->
      <div class="conventions-list" *ngIf="filteredConventions.length > 0; else noResults">
        <div 
          *ngFor="let convention of filteredConventions" 
          class="convention-card"
          [routerLink]="['/workspace/conventions', convention.id]"
        >
          <div class="card-left">
            <div class="ref-section">
              <span class="ref-code">{{ convention.ref }}</span>
              <span class="type-label">{{ convention.type }}</span>
            </div>
            
            <div class="status-section">
              <span class="status-badge" [ngClass]="getStatusClass(convention.status)">
                {{ convention.status }}
              </span>
            </div>
          </div>

          <div class="card-center">
            <div class="dates-row">
              <div class="date-item">
                <span class="date-label">Début:</span>
                <span class="date-value">{{ convention.startDate | date: 'dd/MM/yyyy' }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Fin:</span>
                <span class="date-value">{{ convention.endDate | date: 'dd/MM/yyyy' }}</span>
              </div>
            </div>
            
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="convention.progress"></div>
              </div>
              <span class="progress-text">{{ convention.progress }}%</span>
            </div>
          </div>

          <div class="card-right">
            <span class="link-arrow">→</span>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="no-results">
          <p>Aucune convention ne correspond à vos critères.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .conventions-page {
      padding: 1rem 0;
    }

    .page-header {
      margin-bottom: 2rem;
      h1 { margin: 0; font-size: 1.8rem; color: #2c3e50; }
      .subtitle { margin: 0.5rem 0 0 0; color: #7f8c8d; }
    }

    .filters-bar {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .search-box {
      flex: 1;
      min-width: 250px;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e1e8ed;
      border-radius: 6px;
      font-size: 0.95rem;
      
      &:focus {
        outline: none;
        border-color: #003566;
      }
    }

    .filter-group {
      display: flex;
      gap: 0.75rem;
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

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      .count { color: #7f8c8d; font-size: 0.9rem; }
      
      .btn-clear {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        
        &:hover { background: #c0392b; }
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
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      }
    }

    .card-left {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 200px;

      .ref-section {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .ref-code {
          font-size: 1rem;
          font-weight: 700;
          color: #2c3e50;
          font-family: monospace;
        }

        .type-label {
          font-size: 0.8rem;
          color: #7f8c8d;
        }
      }

      .status-section {
        .status-badge {
          display: inline-block;
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
    }

    .card-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .dates-row {
        display: flex;
        gap: 2rem;

        .date-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .date-label { font-size: 0.75rem; color: #95a5a6; }
          .date-value { font-size: 0.9rem; color: #2c3e50; font-weight: 600; }
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
          font-size: 0.85rem;
          font-weight: 600;
          color: #27ae60;
          min-width: 40px;
        }
      }
    }

    .card-right {
      .link-arrow {
        font-size: 1.5rem;
        color: #003566;
      }
    }

    .no-results {
      background: white;
      padding: 3rem;
      text-align: center;
      border-radius: 8px;
      color: #7f8c8d;
    }
  `]
})
export class WorkspaceConventionsComponent implements OnInit {
  conventions: Convention[] = [];
  filteredConventions: Convention[] = [];
  
  searchTerm: string = '';
  filterStatus: string = '';
  filterType: string = '';

  constructor(private conventionsService: ConventionsService) {}

  ngOnInit() {
    this.loadConventions();
  }

  loadConventions() {
    this.conventionsService.findAll().subscribe({
      next: (data) => {
        this.conventions = data;
        this.filteredConventions = data;
      },
      error: (err) => console.error('Erreur chargement conventions:', err)
    });
  }

  applyFilters() {
    this.filteredConventions = this.conventions.filter(conv => {
      const matchSearch = !this.searchTerm || 
        conv.ref.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchStatus = !this.filterStatus || conv.status === this.filterStatus;
      const matchType = !this.filterType || conv.type === this.filterType;
      
      return matchSearch && matchStatus && matchType;
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatus || this.filterType);
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterType = '';
    this.applyFilters();
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
}
