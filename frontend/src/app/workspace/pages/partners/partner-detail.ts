import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PartnersService } from '../../../services/partners.service';

interface Partner {
  id: string;
  ref: string;
  name: string;
  type: string;
  country: string;
  domain: string;
  status: string;
  email?: string;
  website?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-workspace-partner-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="partner-detail" *ngIf="partner; else loading">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <a routerLink="/workspace/partners">← Retour à l'annuaire</a>
      </div>

      <!-- HEADER -->
      <div class="detail-header">
        <div class="title-section">
          <h1>{{ partner.name }}</h1>
          <span class="ref-badge">{{ partner.ref }}</span>
        </div>
        <span class="status-badge" [class.active]="partner.status === 'Active'">
          {{ partner.status }}
        </span>
      </div>

      <!-- INFO GRID -->
      <div class="info-grid">
        <div class="info-card">
          <h3>Informations Générales</h3>
          <div class="info-row">
            <span class="label">Type d'organisation:</span>
            <span class="value">{{ partner.type }}</span>
          </div>
          <div class="info-row">
            <span class="label">Pays:</span>
            <span class="value">{{ partner.country }}</span>
          </div>
          <div class="info-row">
            <span class="label">Secteur d'activité:</span>
            <span class="value">{{ partner.domain }}</span>
          </div>
          <div class="info-row" *ngIf="partner.createdAt">
            <span class="label">Date de partenariat:</span>
            <span class="value">{{ partner.createdAt | date: 'dd/MM/yyyy' }}</span>
          </div>
        </div>

        <div class="info-card">
          <h3>Coordonnées</h3>
          <div class="info-row" *ngIf="partner.email">
            <span class="label">Email:</span>
            <a [href]="'mailto:' + partner.email" class="value link">{{ partner.email }}</a>
          </div>
          <div class="info-row" *ngIf="partner.website">
            <span class="label">Site web:</span>
            <a [href]="partner.website" target="_blank" class="value link">
              {{ partner.website }} ↗
            </a>
          </div>
          <div class="info-row" *ngIf="!partner.email && !partner.website">
            <span class="no-data">Aucune coordonnée disponible</span>
          </div>
        </div>
      </div>

      <!-- CONVENTIONS SECTION (Placeholder) -->
      <div class="conventions-section">
        <h3>Conventions avec ce partenaire</h3>
        <div class="empty-state">
          <p>Aucune convention enregistrée pour le moment.</p>
        </div>
      </div>

      <!-- DOCUMENTS SECTION (Placeholder) -->
      <div class="documents-section">
        <h3>Documents partagés</h3>
        <div class="empty-state">
          <p>Aucun document public disponible.</p>
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
    .partner-detail {
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
      margin-bottom: 2rem;
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
        }

        .ref-badge {
          padding: 0.5rem 1rem;
          background: #ecf0f1;
          color: #7f8c8d;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: monospace;
        }
      }

      .status-badge {
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        background: #ecf0f1;
        color: #7f8c8d;

        &.active {
          background: #d4edda;
          color: #155724;
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
        font-weight: 500;
      }

      .value {
        color: #2c3e50;
        font-weight: 600;
        text-align: right;

        &.link {
          color: #003566;
          text-decoration: none;
          &:hover { text-decoration: underline; }
        }
      }

      .no-data {
        color: #95a5a6;
        font-style: italic;
        font-size: 0.9rem;
      }
    }

    .conventions-section,
    .documents-section {
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
export class WorkspacePartnerDetailComponent implements OnInit {
  partner: Partner | null = null;

  constructor(
    private route: ActivatedRoute,
    private partnersService: PartnersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPartnerDetail(id);
    }
  }

  loadPartnerDetail(id: string) {
    this.partnersService.findOne(id).subscribe({
      next: (data) => {
        this.partner = data;
      },
      error: (err) => console.error('Erreur chargement partenaire:', err)
    });
  }
}
