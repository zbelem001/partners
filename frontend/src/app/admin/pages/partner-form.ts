import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PartnersService } from '../../services/partners.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="partner-form-page">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Modifier le Partenaire' : 'Nouveau Partenaire' }}</h1>
        <button class="btn-back" (click)="goBack()">← Retour</button>
      </div>

      <form [formGroup]="partnerForm" (ngSubmit)="onSubmit()" class="partner-form">
        <div class="form-section">
          <h2>Informations Générales</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nom du Partenaire *</label>
              <input type="text" formControlName="name" class="form-input">
              <span class="error" *ngIf="partnerForm.get('name')?.invalid && partnerForm.get('name')?.touched">
                Le nom est requis
              </span>
            </div>

            <div class="form-group">
              <label>Type de Partenaire *</label>
              <select formControlName="type" class="form-select">
                <option value="">Sélectionner...</option>
                <option value="Stratégique">Stratégique</option>
                <option value="Opérationnel">Opérationnel</option>
                <option value="Académique">Académique</option>
                <option value="Financier">Financier</option>
                <option value="Institutionnel">Institutionnel</option>
              </select>
              <span class="error" *ngIf="partnerForm.get('type')?.invalid && partnerForm.get('type')?.touched">
                Le type est requis
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pays *</label>
              <input type="text" formControlName="country" class="form-input">
              <span class="error" *ngIf="partnerForm.get('country')?.invalid && partnerForm.get('country')?.touched">
                Le pays est requis
              </span>
            </div>

            <div class="form-group">
              <label>Ville</label>
              <input type="text" formControlName="city" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea formControlName="description" class="form-textarea" rows="4"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Contact Principal</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nom du Contact *</label>
              <input type="text" formControlName="contactName" class="form-input">
              <span class="error" *ngIf="partnerForm.get('contactName')?.invalid && partnerForm.get('contactName')?.touched">
                Le nom du contact est requis
              </span>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" class="form-input">
              <span class="error" *ngIf="partnerForm.get('email')?.invalid && partnerForm.get('email')?.touched">
                Email valide requis
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" formControlName="phone" class="form-input">
            </div>

            <div class="form-group">
              <label>Site Web</label>
              <input type="url" formControlName="website" class="form-input">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Informations Complémentaires</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Secteur d'Activité</label>
              <input type="text" formControlName="sector" class="form-input">
            </div>

            <div class="form-group">
              <label>Statut *</label>
              <select formControlName="status" class="form-select">
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Annuler</button>
          <button type="submit" class="btn btn-primary" [disabled]="partnerForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer le Partenaire') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .partner-form-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.8rem;
      }

      .btn-back {
        background: white;
        border: 1px solid #ddd;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        color: #7f8c8d;
        
        &:hover {
          background: #f5f5f5;
        }
      }
    }

    .partner-form {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-section {
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;

      &:last-of-type {
        border-bottom: none;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        color: #003566;
        font-size: 1.2rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.9rem;
      }

      .form-input, .form-select, .form-textarea {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
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
        font-family: inherit;
      }

      .error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
    }

    .form-actions {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      &.btn-outline {
        background: white;
        border: 1px solid #ddd;
        color: #7f8c8d;

        &:hover {
          background: #f5f5f5;
        }
      }

      &.btn-primary {
        background: #003566;
        color: white;

        &:hover:not(:disabled) {
          background: #002447;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PartnerFormComponent implements OnInit {
  partnerForm: FormGroup;
  isEditMode = false;
  partnerId?: string;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private partnersService: PartnersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.partnerForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      description: [''],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      sector: [''],
      status: ['Actif', Validators.required]
    });
  }

  ngOnInit() {
    this.partnerId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.partnerId) {
      this.isEditMode = true;
      this.loadPartner();
    }
  }

  loadPartner() {
    if (!this.partnerId) return;

    this.partnersService.findOne(this.partnerId).subscribe({
      next: (partner: any) => {
        this.partnerForm.patchValue({
          name: partner.name,
          type: partner.type,
          country: partner.country,
          city: partner.city || '',
          description: partner.description || '',
          contactName: partner.contactName || '',
          email: partner.email || '',
          phone: partner.phone || '',
          website: partner.website || '',
          sector: partner.sector || '',
          status: partner.status || 'Actif'
        });
      },
      error: (err: any) => {
        console.error('Erreur chargement partenaire:', err);
        this.toastService.error('Erreur lors du chargement du partenaire');
      }
    });
  }

  onSubmit() {
    if (this.partnerForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.partnerForm.value;

    const action = this.isEditMode && this.partnerId
      ? this.partnersService.update(this.partnerId, formData)
      : this.partnersService.create(formData);

    action.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success(
          this.isEditMode ? 'Partenaire mis à jour avec succès' : 'Partenaire créé avec succès'
        );
        this.router.navigate(['/admin/partners']);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.isSubmitting = false;
        this.toastService.error('Une erreur est survenue');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/partners']);
  }
}
