import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
}

@Component({
  selector: 'app-workspace-partners',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="partners-page">
      <div class="page-header">
        <h1>Annuaire des Partenaires</h1>
        <p class="subtitle">Consultez l'ensemble des partenaires de 2iE</p>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="filters-bar">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Rechercher par nom..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="filterCountry" (change)="applyFilters()" class="filter-select">
            <option value="">Tous les pays</option>
            <option *ngFor="let country of availableCountries" [value]="country">
              {{ country }}
            </option>
          </select>

          <select [(ngModel)]="filterDomain" (change)="applyFilters()" class="filter-select">
            <option value="">Tous les secteurs</option>
            <option *ngFor="let domain of availableDomains" [value]="domain">
              {{ domain }}
            </option>
          </select>

          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="Active">Actif</option>
            <option value="Inactive">Inactif</option>
          </select>
        </div>
      </div>

      <!-- RESULTS COUNT -->
      <div class="results-info">
        <span class="count">{{ filteredPartners.length }} partenaire(s) trouvé(s)</span>
        <button *ngIf="hasActiveFilters()" (click)="clearFilters()" class="btn-clear">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- PARTNERS GRID -->
      <div class="partners-grid" *ngIf="filteredPartners.length > 0; else noResults">
        <div 
          *ngFor="let partner of filteredPartners" 
          class="partner-card"
          [routerLink]="['/workspace/partners', partner.id]"
        >
          <div class="card-header">
            <h3 class="partner-name">{{ partner.name }}</h3>
            <span class="status-badge" [class.active]="partner.status === 'Active'">
              {{ partner.status }}
            </span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">{{ partner.type }}</span>
            </div>
            <div class="info-row">
              <span class="label">Pays:</span>
              <span class="value">{{ partner.country }}</span>
            </div>
            <div class="info-row">
              <span class="label">Secteur:</span>
              <span class="value">{{ partner.domain }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="ref-code">{{ partner.ref }}</span>
            <span class="link-text">Voir détails →</span>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="no-results">
          <p>Aucun partenaire ne correspond à vos critères de recherche.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .partners-page {
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
      transition: border-color 0.2s;
      
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

    .partners-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .partner-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      
      .partner-name {
        margin: 0;
        font-size: 1.1rem;
        color: #2c3e50;
        flex: 1;
      }
      
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        background: #ecf0f1;
        color: #7f8c8d;
        
        &.active {
          background: #d4edda;
          color: #155724;
        }
      }
    }

    .card-body {
      margin-bottom: 1rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f8f9fa;
      
      .label { color: #7f8c8d; font-size: 0.85rem; }
      .value { color: #2c3e50; font-weight: 500; font-size: 0.9rem; }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eef2f6;
      
      .ref-code { color: #95a5a6; font-size: 0.8rem; font-family: monospace; }
      .link-text { color: #003566; font-size: 0.85rem; font-weight: 600; }
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
export class WorkspacePartnersComponent implements OnInit {
  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  
  searchTerm: string = '';
  filterCountry: string = '';
  filterDomain: string = '';
  filterStatus: string = '';
  
  availableCountries: string[] = [];
  availableDomains: string[] = [];

  constructor(private partnersService: PartnersService) {}

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.partnersService.findAll().subscribe({
      next: (data) => {
        this.partners = data;
        this.filteredPartners = data;
        this.extractFilterOptions();
      },
      error: (err) => console.error('Erreur chargement partenaires:', err)
    });
  }

  extractFilterOptions() {
    this.availableCountries = [...new Set(this.partners.map(p => p.country))].sort();
    this.availableDomains = [...new Set(this.partners.map(p => p.domain))].sort();
  }

  applyFilters() {
    this.filteredPartners = this.partners.filter(partner => {
      const matchSearch = !this.searchTerm || 
        partner.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchCountry = !this.filterCountry || partner.country === this.filterCountry;
      const matchDomain = !this.filterDomain || partner.domain === this.filterDomain;
      const matchStatus = !this.filterStatus || partner.status === this.filterStatus;
      
      return matchSearch && matchCountry && matchDomain && matchStatus;
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterCountry || this.filterDomain || this.filterStatus);
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterCountry = '';
    this.filterDomain = '';
    this.filterStatus = '';
    this.applyFilters();
  }
}
