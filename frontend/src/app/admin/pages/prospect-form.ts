import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProspectsService } from '../../services/prospects.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-prospect-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="prospect-form-page">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Modifier la Demande' : 'Nouvelle Demande de Partenariat' }}</h1>
        <button class="btn-back" (click)="goBack()">← Retour</button>
      </div>

      <form [formGroup]="prospectForm" (ngSubmit)="onSubmit()" class="prospect-form">
        <div class="form-section">
          <h2>Informations de l'Organisation</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nom de l'Organisation *</label>
              <input type="text" formControlName="companyName" class="form-input">
              <span class="error" *ngIf="prospectForm.get('companyName')?.invalid && prospectForm.get('companyName')?.touched">
                Le nom est requis
              </span>
            </div>

            <div class="form-group">
              <label>Type de Partenariat *</label>
              <select formControlName="type" class="form-select">
                <option value="">Sélectionner...</option>
                <option value="Académique">Académique</option>
                <option value="Recherche">Recherche</option>
                <option value="Industriel">Industriel</option>
                <option value="Institutionnel">Institutionnel</option>
                <option value="ONG">ONG</option>
              </select>
              <span class="error" *ngIf="prospectForm.get('type')?.invalid && prospectForm.get('type')?.touched">
                Le type est requis
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pays *</label>
              <input type="text" formControlName="country" class="form-input">
              <span class="error" *ngIf="prospectForm.get('country')?.invalid && prospectForm.get('country')?.touched">
                Le pays est requis
              </span>
            </div>

            <div class="form-group">
              <label>Ville</label>
              <input type="text" formControlName="city" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Description de l'Organisation</label>
            <textarea formControlName="description" class="form-textarea" rows="3"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Contact</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nom du Contact *</label>
              <input type="text" formControlName="contactName" class="form-input">
              <span class="error" *ngIf="prospectForm.get('contactName')?.invalid && prospectForm.get('contactName')?.touched">
                Le nom du contact est requis
              </span>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" class="form-input">
              <span class="error" *ngIf="prospectForm.get('email')?.invalid && prospectForm.get('email')?.touched">
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
              <label>Fonction</label>
              <input type="text" formControlName="position" class="form-input">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Détails du Partenariat</h2>
          
          <div class="form-group">
            <label>Objectifs et Motivations *</label>
            <textarea formControlName="motivation" class="form-textarea" rows="4" 
              placeholder="Décrivez les objectifs et motivations de ce partenariat..."></textarea>
            <span class="error" *ngIf="prospectForm.get('motivation')?.invalid && prospectForm.get('motivation')?.touched">
              Les objectifs sont requis
            </span>
          </div>

          <div class="form-group">
            <label>Domaines de Collaboration *</label>
            <textarea formControlName="collaborationAreas" class="form-textarea" rows="3"
              placeholder="Formation, recherche, mobilité, projets communs..."></textarea>
            <span class="error" *ngIf="prospectForm.get('collaborationAreas')?.invalid && prospectForm.get('collaborationAreas')?.touched">
              Les domaines de collaboration sont requis
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Statut de la Demande</label>
              <select formControlName="status" class="form-select">
                <option value="pending">En attente</option>
                <option value="under_review">En cours de révision</option>
                <option value="approved">Approuvée</option>
                <option value="rejected">Rejetée</option>
              </select>
            </div>

            <div class="form-group">
              <label>Priorité</label>
              <select formControlName="priority" class="form-select">
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Annuler</button>
          <button type="submit" class="btn btn-primary" [disabled]="prospectForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer la Demande') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .prospect-form-page {
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

    .prospect-form {
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
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }

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
export class ProspectFormComponent implements OnInit {
  prospectForm: FormGroup;
  isEditMode = false;
  prospectId?: string;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private prospectsService: ProspectsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.prospectForm = this.fb.group({
      companyName: ['', Validators.required],
      type: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      description: [''],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      position: [''],
      motivation: ['', Validators.required],
      collaborationAreas: ['', Validators.required],
      status: ['pending'],
      priority: ['medium']
    });
  }

  ngOnInit() {
    this.prospectId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.prospectId) {
      this.isEditMode = true;
      this.loadProspect();
    }
  }

  loadProspect() {
    if (!this.prospectId) return;

    this.prospectsService.findOne(this.prospectId).subscribe({
      next: (prospect: any) => {
        this.prospectForm.patchValue({
          companyName: prospect.companyName,
          type: prospect.type,
          country: prospect.country || '',
          city: prospect.city || '',
          description: prospect.description || '',
          contactName: prospect.contactName,
          email: prospect.email,
          phone: prospect.phone || '',
          position: prospect.position || '',
          motivation: prospect.motivation || '',
          collaborationAreas: prospect.collaborationAreas || '',
          status: prospect.status || 'pending',
          priority: prospect.priority || 'medium'
        });
      },
      error: (err: any) => {
        console.error('Erreur chargement prospect:', err);
        this.toastService.error('Erreur lors du chargement de la demande');
      }
    });
  }

  onSubmit() {
    if (this.prospectForm.invalid) return;

    this.isSubmitting = true;
    const formData = {
      ...this.prospectForm.value,
      submissionDate: new Date().toISOString()
    };

    const action = this.isEditMode && this.prospectId
      ? this.prospectsService.update(this.prospectId, formData)
      : this.prospectsService.create(formData);

    action.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success(
          this.isEditMode ? 'Demande mise à jour avec succès' : 'Demande créée avec succès'
        );
        this.router.navigate(['/admin/prospects']);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.isSubmitting = false;
        this.toastService.error('Une erreur est survenue');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/prospects']);
  }
}
