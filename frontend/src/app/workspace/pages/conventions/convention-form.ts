import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConventionsService } from '../../../services/conventions.service';
import { PartnersService } from '../../../services/partners.service';

interface Partner {
  id: string;
  name: string;
  country: string;
  domain: string;
}

@Component({
  selector: 'app-convention-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="convention-form-page">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <a routerLink="/workspace/conventions">← Retour aux conventions</a>
      </div>

      <!-- HEADER -->
      <div class="form-header">
        <h1>{{ isEditMode ? 'Modifier la convention' : 'Nouvelle Convention' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Modifiez les informations de la convention' : 'Créez une nouvelle convention de partenariat' }}</p>
      </div>

      <!-- FORM -->
      <form [formGroup]="conventionForm" (ngSubmit)="onSubmit()" class="convention-form">
        <!-- PARTNER SELECTION -->
        <div class="form-section">
          <h2 class="section-title">Partenaire</h2>
          
          <div class="form-group">
            <label class="form-label">Sélectionner le partenaire *</label>
            <div class="partner-search">
              <input 
                type="text" 
                class="form-input"
                placeholder="Rechercher un partenaire..."
                [(ngModel)]="partnerSearchTerm"
                [ngModelOptions]="{standalone: true}"
                (input)="filterPartners()"
              />
            </div>

            <div class="partners-list" *ngIf="filteredPartners.length > 0 && !selectedPartner">
              <div 
                *ngFor="let partner of filteredPartners" 
                class="partner-item"
                (click)="selectPartner(partner)"
              >
                <div class="partner-info">
                  <strong>{{ partner.name }}</strong>
                  <span class="partner-meta">{{ partner.country }} - {{ partner.domain }}</span>
                </div>
              </div>
            </div>

            <div class="selected-partner" *ngIf="selectedPartner">
              <div class="partner-card">
                <div class="partner-details">
                  <strong>{{ selectedPartner.name }}</strong>
                  <span class="partner-meta">{{ selectedPartner.country }} - {{ selectedPartner.domain }}</span>
                </div>
                <button 
                  type="button" 
                  class="btn-remove"
                  (click)="removePartner()"
                >
                  Changer
                </button>
              </div>
            </div>

            <div class="form-error" *ngIf="conventionForm.get('partnerId')?.invalid && conventionForm.get('partnerId')?.touched">
              Le partenaire est obligatoire
            </div>
          </div>
        </div>

        <!-- CONVENTION INFO -->
        <div class="form-section">
          <h2 class="section-title">Informations générales</h2>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Référence *</label>
              <input 
                type="text" 
                class="form-input"
                formControlName="ref"
                placeholder="Ex: CONV-2026-001"
              />
              <div class="form-error" *ngIf="conventionForm.get('ref')?.invalid && conventionForm.get('ref')?.touched">
                La référence est obligatoire
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Type de convention *</label>
              <select class="form-input" formControlName="type">
                <option value="">Sélectionner un type</option>
                <option value="Exchange">Échange étudiant</option>
                <option value="Research">Recherche</option>
                <option value="Training">Formation</option>
                <option value="Academic">Académique</option>
                <option value="Technical">Technique</option>
                <option value="Other">Autre</option>
              </select>
              <div class="form-error" *ngIf="conventionForm.get('type')?.invalid && conventionForm.get('type')?.touched">
                Le type est obligatoire
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date de début *</label>
              <input 
                type="date" 
                class="form-input"
                formControlName="startDate"
              />
              <div class="form-error" *ngIf="conventionForm.get('startDate')?.invalid && conventionForm.get('startDate')?.touched">
                La date de début est obligatoire
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Date de fin *</label>
              <input 
                type="date" 
                class="form-input"
                formControlName="endDate"
              />
              <div class="form-error" *ngIf="conventionForm.get('endDate')?.invalid && conventionForm.get('endDate')?.touched">
                La date de fin est obligatoire
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Objectifs de la convention</label>
            <textarea 
              class="form-textarea"
              formControlName="objectives"
              placeholder="Décrivez les objectifs principaux de cette convention..."
              rows="5"
            ></textarea>
          </div>

          <div class="form-group" *ngIf="isEditMode">
            <label class="form-label">Statut</label>
            <select class="form-input" formControlName="status">
              <option value="Draft">Brouillon</option>
              <option value="Active">Active</option>
              <option value="Signed">Signée</option>
              <option value="Ended">Terminée</option>
            </select>
          </div>

          <div class="form-group" *ngIf="isEditMode">
            <label class="form-label">Progression (%)</label>
            <div class="progress-input-group">
              <input 
                type="number" 
                class="form-input"
                formControlName="progress"
                min="0"
                max="100"
                placeholder="0"
              />
              <span class="progress-suffix">%</span>
            </div>
            <div class="progress-bar-preview">
              <div 
                class="progress-fill" 
                [style.width.%]="conventionForm.get('progress')?.value || 0"
              ></div>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="form-actions">
          <button 
            type="button" 
            class="btn-cancel"
            (click)="onCancel()"
          >
            Annuler
          </button>
          
          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="conventionForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Enregistrer les modifications' : 'Créer la convention') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .convention-form-page {
      max-width: 900px;
      margin: 0 auto;
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

    .form-header {
      margin-bottom: 2rem;
      
      h1 {
        margin: 0;
        font-size: 1.8rem;
        color: #2c3e50;
      }
      
      .subtitle {
        margin: 0.5rem 0 0 0;
        color: #7f8c8d;
      }
    }

    .convention-form {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .form-section {
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;

      &:last-of-type {
        border-bottom: none;
      }

      .section-title {
        margin: 0 0 1.5rem 0;
        font-size: 1.2rem;
        color: #2c3e50;
        font-weight: 600;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #003566;
      }

      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .form-error {
      margin-top: 0.5rem;
      color: #e74c3c;
      font-size: 0.85rem;
    }

    /* Partner Selection */
    .partner-search {
      margin-bottom: 0.5rem;
    }

    .partners-list {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
    }

    .partner-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f8f9fa;
      }

      .partner-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        strong {
          color: #2c3e50;
        }

        .partner-meta {
          font-size: 0.85rem;
          color: #7f8c8d;
        }
      }
    }

    .selected-partner {
      .partner-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #e8f4f8;
        border: 1px solid #003566;
        border-radius: 6px;

        .partner-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          strong {
            color: #003566;
          }

          .partner-meta {
            font-size: 0.85rem;
            color: #00509d;
          }
        }

        .btn-remove {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #003566;
          color: #003566;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;

          &:hover {
            background: #003566;
            color: white;
          }
        }
      }
    }

    /* Progress Input */
    .progress-input-group {
      position: relative;

      .form-input {
        padding-right: 2.5rem;
      }

      .progress-suffix {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #7f8c8d;
        pointer-events: none;
      }
    }

    .progress-bar-preview {
      margin-top: 0.75rem;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00509d, #003566);
        transition: width 0.3s;
      }
    }

    /* Actions */
    .form-actions {
      padding: 1.5rem 2rem;
      background: #f8f9fa;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-cancel, .btn-submit {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-cancel {
      background: white;
      border: 1px solid #ddd;
      color: #7f8c8d;

      &:hover {
        background: #f5f5f5;
      }
    }

    .btn-submit {
      background: #003566;
      color: white;

      &:hover:not(:disabled) {
        background: #00509d;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `]
})
export class ConventionFormComponent implements OnInit {
  conventionForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  conventionId?: string;

  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  selectedPartner?: Partner;
  partnerSearchTerm = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private conventionsService: ConventionsService,
    private partnersService: PartnersService
  ) {
    this.conventionForm = this.fb.group({
      ref: ['', Validators.required],
      partnerId: ['', Validators.required],
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      objectives: [''],
      status: ['Draft'],
      progress: [0]
    });
  }

  ngOnInit() {
    // Load partners
    this.loadPartners();

    // Check if edit mode
    this.conventionId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.conventionId) {
      this.isEditMode = true;
      this.loadConvention(this.conventionId);
    }
  }

  loadPartners() {
    this.partnersService.findAll().subscribe({
      next: (data) => {
        this.partners = data;
        this.filteredPartners = data;
      },
      error: (err) => console.error('Erreur chargement partenaires:', err)
    });
  }

  loadConvention(id: string) {
    this.conventionsService.findOne(id).subscribe({
      next: (data) => {
        this.conventionForm.patchValue({
          ref: data.ref,
          partnerId: data.partnerId,
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          objectives: data.objectives,
          status: data.status,
          progress: data.progress || 0
        });

        // Load partner info
        const partner = this.partners.find(p => p.id === data.partnerId);
        if (partner) {
          this.selectedPartner = partner;
        }
      },
      error: (err) => console.error('Erreur chargement convention:', err)
    });
  }

  filterPartners() {
    const term = this.partnerSearchTerm.toLowerCase();
    if (!term) {
      this.filteredPartners = this.partners;
    } else {
      this.filteredPartners = this.partners.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.country.toLowerCase().includes(term) ||
        p.domain.toLowerCase().includes(term)
      );
    }
  }

  selectPartner(partner: Partner) {
    this.selectedPartner = partner;
    this.conventionForm.patchValue({ partnerId: partner.id });
    this.partnerSearchTerm = '';
    this.filteredPartners = [];
  }

  removePartner() {
    this.selectedPartner = undefined;
    this.conventionForm.patchValue({ partnerId: '' });
    this.filteredPartners = this.partners;
  }

  onSubmit() {
    if (this.conventionForm.invalid) {
      Object.keys(this.conventionForm.controls).forEach(key => {
        this.conventionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.conventionForm.value;

    const operation = this.isEditMode && this.conventionId
      ? this.conventionsService.update(this.conventionId, formData)
      : this.conventionsService.create(formData);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/workspace/conventions']);
      },
      error: (err) => {
        console.error('Erreur sauvegarde convention:', err);
        this.isSubmitting = false;
        alert('Erreur lors de la sauvegarde de la convention');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/workspace/conventions']);
  }
}
