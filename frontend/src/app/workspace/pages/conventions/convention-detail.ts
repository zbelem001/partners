import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConventionsService } from '../../../services/conventions.service';
import { PartnersService } from '../../../services/partners.service';

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

interface Partner {
  id: string;
  name: string;
  country: string;
}

@Component({
  selector: 'app-workspace-convention-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="convention-detail" *ngIf="convention; else loading">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <a routerLink="/workspace/conventions">← Retour aux conventions</a>
      </div>

      <!-- HEADER -->
      <div class="detail-header">
        <div class="title-section">
          <h1>{{ convention.ref }}</h1>
          <span class="type-badge">{{ convention.type }}</span>
        </div>
        <span class="status-badge" [ngClass]="getStatusClass(convention.status)">
          {{ convention.status }}
        </span>
      </div>

      <!-- PARTNER INFO -->
      <div class="partner-info" *ngIf="partner">
        <div class="info-label">Partenaire:</div>
        <div class="partner-name">
          <a [routerLink]="['/workspace/partners', partner.id]">
            {{ partner.name }} ({{ partner.country }})
          </a>
        </div>
      </div>

      <!-- INFO GRID -->
      <div class="info-grid">
        <div class="info-card">
          <h3>Période de validité</h3>
          <div class="info-row">
            <span class="label">Date de début:</span>
            <span class="value">{{ convention.startDate | date: 'dd MMMM yyyy' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Date de fin:</span>
            <span class="value">{{ convention.endDate | date: 'dd MMMM yyyy' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Durée:</span>
            <span class="value">{{ calculateDuration() }} mois</span>
          </div>
        </div>

        <div class="info-card">
          <h3>Avancement</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="convention.progress"></div>
            </div>
            <span class="progress-label">{{ convention.progress }}% complété</span>
          </div>
          <div class="info-row" *ngIf="convention.createdAt">
            <span class="label">Créée le:</span>
            <span class="value">{{ convention.createdAt | date: 'dd/MM/yyyy' }}</span>
          </div>
        </div>
      </div>

      <!-- DOCUMENTS SECTION -->
      <div class="section-card">
        <h3>Documents</h3>
        <div class="empty-state">
          <p>Aucun document disponible pour cette convention.</p>
        </div>
      </div>

      <!-- WORKFLOW SECTION -->
      <div class="section-card">
        <h3>Étapes de validation</h3>
        <div class="empty-state">
          <p>Aucune étape de validation enregistrée.</p>
        </div>
      </div>

      <!-- ACTIVITIES SECTION -->
      <div class="section-card">
        <h3>Historique d'activités</h3>
        <div class="empty-state">
          <p>Aucune activité enregistrée.</p>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-state">
        <p>Chargement des détails...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .convention-detail {
      padding: 1rem 0;
    }

    .breadcrumb {
      margin-bottom: 1.5rem;
      a {
        color: #003566;
        text-decoration: none;
        font-size: 0.9rem;
        &:hover { text-decoration: underline; }
      }
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eef2f6;

      .title-section {
        display: flex;
        align-items: center;
        gap: 1rem;

        h1 {
          margin: 0;
          font-size: 2rem;
          color: #2c3e50;
          font-family: monospace;
        }

        .type-badge {
          padding: 0.5rem 1rem;
          background: #ecf0f1;
          color: #5d6d7e;
          border-radius: 6px;
          font-size: 0.85rem;
        }
      }

      .status-badge {
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;

        &.draft { background: #f0f3f4; color: #5d6d7e; }
        &.active { background: #d4edda; color: #155724; }
        &.signed { background: #cce5ff; color: #004085; }
        &.ended { background: #f8d7da; color: #721c24; }
      }
    }

    .partner-info {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;

      .info-label {
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      .partner-name {
        font-size: 1.1rem;
        font-weight: 600;

        a {
          color: #003566;
          text-decoration: none;
          &:hover { text-decoration: underline; }
        }
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .info-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        color: #2c3e50;
        border-bottom: 1px solid #eef2f6;
        padding-bottom: 0.5rem;
      }
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f8f9fa;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      .value {
        color: #2c3e50;
        font-weight: 600;
        text-align: right;
      }
    }

    .progress-container {
      margin-bottom: 1rem;

      .progress-bar {
        width: 100%;
        height: 20px;
        background: #ecf0f1;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 0.5rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #27ae60, #2ecc71);
          transition: width 0.3s;
        }
      }

      .progress-label {
        display: block;
        text-align: center;
        font-size: 0.9rem;
        color: #27ae60;
        font-weight: 600;
      }
    }

    .section-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        color: #2c3e50;
      }

      .empty-state {
        padding: 2rem;
        text-align: center;
        color: #95a5a6;
        background: #f8f9fa;
        border-radius: 6px;
      }
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #7f8c8d;
    }
  `]
})
export class WorkspaceConventionDetailComponent implements OnInit {
  convention: Convention | null = null;
  partner: Partner | null = null;

  constructor(
    private route: ActivatedRoute,
    private conventionsService: ConventionsService,
    private partnersService: PartnersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadConventionDetail(id);
    }
  }

  loadConventionDetail(id: string) {
    this.conventionsService.findOne(id).subscribe({
      next: (data) => {
        this.convention = data;
        if (data.partnerId) {
          this.loadPartner(data.partnerId);
        }
      },
      error: (err) => console.error('Erreur chargement convention:', err)
    });
  }

  loadPartner(partnerId: string) {
    this.partnersService.findOne(partnerId).subscribe({
      next: (data) => {
        this.partner = data;
      },
      error: (err) => console.error('Erreur chargement partenaire:', err)
    });
  }

  calculateDuration(): number {
    if (!this.convention || !this.convention.startDate || !this.convention.endDate) return 0;
    const start = new Date(this.convention.startDate);
    const end = new Date(this.convention.endDate);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                       (end.getMonth() - start.getMonth());
    return Math.max(0, diffMonths);
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
