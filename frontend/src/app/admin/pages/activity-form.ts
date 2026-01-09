import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MilestonesService } from '../../services/milestones.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="activity-form-page">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Modifier l\'Activité' : 'Nouvelle Activité / Jalon' }}</h1>
        <button class="btn-back" (click)="goBack()">← Retour</button>
      </div>

      <form [formGroup]="activityForm" (ngSubmit)="onSubmit()" class="activity-form">
        <div class="form-section">
          <h2>Informations Principales</h2>
          
          <div class="form-group">
            <label>Titre de l'Activité *</label>
            <input type="text" formControlName="title" class="form-input"
              placeholder="Ex: Signature convention, Atelier de formation...">
            <span class="error" *ngIf="activityForm.get('title')?.invalid && activityForm.get('title')?.touched">
              Le titre est requis
            </span>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea formControlName="description" class="form-textarea" rows="4"
              placeholder="Décrivez l'activité, ses objectifs et son déroulement..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Type d'Activité *</label>
              <select formControlName="type" class="form-select">
                <option value="">Sélectionner...</option>
                <option value="meeting">Réunion</option>
                <option value="workshop">Atelier</option>
                <option value="signature">Signature</option>
                <option value="training">Formation</option>
                <option value="evaluation">Évaluation</option>
                <option value="deliverable">Livrable</option>
                <option value="milestone">Jalon</option>
                <option value="other">Autre</option>
              </select>
              <span class="error" *ngIf="activityForm.get('type')?.invalid && activityForm.get('type')?.touched">
                Le type est requis
              </span>
            </div>

            <div class="form-group">
              <label>Statut *</label>
              <select formControlName="status" class="form-select">
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Complété</option>
                <option value="cancelled">Annulé</option>
                <option value="delayed">Retardé</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date Prévue *</label>
              <input type="date" formControlName="dueDate" class="form-input">
              <span class="error" *ngIf="activityForm.get('dueDate')?.invalid && activityForm.get('dueDate')?.touched">
                La date est requise
              </span>
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

        <div class="form-section">
          <h2>Convention Associée (Optionnel)</h2>
          
          <div class="form-group">
            <label>Référence Convention</label>
            <input type="text" formControlName="conventionRef" class="form-input"
              placeholder="Ex: CONV-2024-001">
            <small class="help-text">Laissez vide si l'activité n'est pas liée à une convention spécifique</small>
          </div>
        </div>

        <div class="form-section">
          <h2>Responsabilité et Suivi</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Responsable</label>
              <input type="text" formControlName="responsible" class="form-input"
                placeholder="Nom du responsable">
            </div>

            <div class="form-group">
              <label>Participants</label>
              <input type="text" formControlName="participants" class="form-input"
                placeholder="Noms des participants (séparés par des virgules)">
            </div>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea formControlName="notes" class="form-textarea" rows="3"
              placeholder="Notes complémentaires, décisions prises..."></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Annuler</button>
          <button type="submit" class="btn btn-primary" [disabled]="activityForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer l\'Activité') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .activity-form-page {
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

    .activity-form {
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

      .help-text {
        color: #7f8c8d;
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
export class ActivityFormComponent implements OnInit {
  activityForm: FormGroup;
  isEditMode = false;
  activityId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private milestonesService: MilestonesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      status: ['planned'],
      dueDate: ['', Validators.required],
      priority: ['medium'],
      conventionRef: [''],
      responsible: [''],
      participants: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.activityId = id ? parseInt(id, 10) : undefined;
    if (this.activityId) {
      this.isEditMode = true;
      this.loadActivity();
    }
  }

  loadActivity() {
    if (!this.activityId) return;

    this.milestonesService.findOne(this.activityId).subscribe({
      next: (activity: any) => {
        this.activityForm.patchValue({
          title: activity.title || activity.name,
          description: activity.description || '',
          type: activity.type || 'milestone',
          status: activity.status || 'planned',
          dueDate: activity.dueDate ? activity.dueDate.split('T')[0] : '',
          priority: activity.priority || 'medium',
          conventionRef: activity.conventionRef || '',
          responsible: activity.responsible || '',
          participants: activity.participants || '',
          notes: activity.notes || ''
        });
      },
      error: (err: any) => {
        console.error('Erreur chargement activité:', err);
        this.toastService.error('Erreur lors du chargement de l\'activité');
      }
    });
  }

  onSubmit() {
    if (this.activityForm.invalid) return;

    this.isSubmitting = true;
    const formData = {
      ...this.activityForm.value,
      name: this.activityForm.value.title  // Backend might expect 'name' instead of 'title'
    };

    const action = this.isEditMode && this.activityId
      ? this.milestonesService.update(this.activityId, formData)
      : this.milestonesService.create(formData);

    action.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success(
          this.isEditMode ? 'Activité mise à jour avec succès' : 'Activité créée avec succès'
        );
        this.router.navigate(['/admin/activities']);
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.isSubmitting = false;
        this.toastService.error('Une erreur est survenue');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/activities']);
  }
}
