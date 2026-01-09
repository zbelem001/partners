import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConventionsService } from '../../../services/conventions.service';
import { WorkflowService, ValidationHistory, Convention } from '../../../services/workflow.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-validation-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="validation-page">
      <div class="page-header">
        <h1>Conventions à Valider</h1>
        <p class="subtitle">Validez les conventions en attente de votre approbation</p>
      </div>

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-card pending">
          <span class="stat-value">{{ pendingConventions.length }}</span>
          <span class="stat-label">En attente</span>
        </div>
        <div class="stat-card info">
          <span class="stat-value">{{ userRole }}</span>
          <span class="stat-label">Votre rôle</span>
        </div>
      </div>

      <!-- CONVENTIONS LIST -->
      <div class="conventions-list" *ngIf="pendingConventions.length > 0; else noConventions">
        <div *ngFor="let convention of pendingConventions" class="convention-card">
          <div class="card-header">
            <div class="ref-section">
              <h3>{{ convention.ref }}</h3>
              <span class="partner-name" *ngIf="convention.partnerName">
                {{ convention.partnerName }}
              </span>
            </div>
            <span class="validation-badge">
              {{ getValidationLabel(convention.validationStatus) }}
            </span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <strong>Type:</strong> {{ convention.type }}
            </div>
            <div class="info-row" *ngIf="convention.objectives">
              <strong>Objectifs:</strong> {{ convention.objectives }}
            </div>
            <div class="info-row" *ngIf="convention.startDate && convention.endDate">
              <strong>Période:</strong> 
              {{ convention.startDate | date: 'dd/MM/yyyy' }} - 
              {{ convention.endDate | date: 'dd/MM/yyyy' }}
            </div>
          </div>

          <div class="validation-progress" *ngIf="convention.validatedBy">
            <div class="progress-step" [class.completed]="convention.validatedBy.srecip">
              <span class="step-icon">{{ convention.validatedBy.srecip ? '✓' : '○' }}</span>
              <span class="step-label">SRECIP</span>
            </div>
            <div class="progress-line"></div>
            <div class="progress-step" [class.completed]="convention.validatedBy.dfc">
              <span class="step-icon">{{ convention.validatedBy.dfc ? '✓' : '○' }}</span>
              <span class="step-label">DFC</span>
            </div>
            <div class="progress-line"></div>
            <div class="progress-step" [class.completed]="convention.validatedBy.caq">
              <span class="step-icon">{{ convention.validatedBy.caq ? '✓' : '○' }}</span>
              <span class="step-label">CAQ</span>
            </div>
            <div class="progress-line"></div>
            <div class="progress-step" [class.completed]="convention.validatedBy.dg">
              <span class="step-icon">{{ convention.validatedBy.dg ? '✓' : '○' }}</span>
              <span class="step-label">DG</span>
            </div>
          </div>

          <div class="card-actions">
            <button 
              class="btn-secondary"
              (click)="viewDetails(convention)"
            >
              Voir détails
            </button>
            <button 
              class="btn-reject"
              (click)="openValidationModal(convention, 'REJECTED')"
            >
              Rejeter
            </button>
            <button 
              class="btn-approve"
              (click)="openValidationModal(convention, 'APPROVED')"
            >
              Approuver
            </button>
          </div>
        </div>
      </div>

      <ng-template #noConventions>
        <div class="empty-state">
          <div class="empty-icon">✓</div>
          <h3>Aucune convention en attente</h3>
          <p>Vous n'avez pas de conventions à valider pour le moment.</p>
        </div>
      </ng-template>
    </div>

    <!-- VALIDATION MODAL -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ validationAction === 'APPROVED' ? 'Approuver' : 'Rejeter' }} la convention</h2>
          <button class="btn-close" (click)="closeModal()">×</button>
        </div>

        <div class="modal-body">
          <div class="convention-info">
            <strong>{{ selectedConvention?.ref }}</strong>
            <p>{{ selectedConvention?.type }}</p>
          </div>

          <div class="form-group">
            <label>Commentaire {{ validationAction === 'REJECTED' ? '(obligatoire)' : '(optionnel)' }}</label>
            <textarea 
              [(ngModel)]="validationComment"
              class="form-textarea"
              rows="4"
              placeholder="Ajoutez vos remarques ou raisons..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" (click)="closeModal()">Annuler</button>
          <button 
            class="btn-submit"
            [class.btn-reject]="validationAction === 'REJECTED'"
            [class.btn-approve]="validationAction === 'APPROVED'"
            [disabled]="isSubmitting || (validationAction === 'REJECTED' && !validationComment)"
            (click)="submitValidation()"
          >
            {{ isSubmitting ? 'En cours...' : (validationAction === 'APPROVED' ? 'Confirmer l\'approbation' : 'Confirmer le rejet') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .validation-page {
      padding: 1rem 0;
    }

    .page-header {
      margin-bottom: 2rem;
      
      h1 { margin: 0; font-size: 1.8rem; color: #2c3e50; }
      .subtitle { margin: 0.5rem 0 0 0; color: #7f8c8d; }
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;

      &.pending { border-left: 4px solid #f39c12; }
      &.info { border-left: 4px solid #003566; }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: #2c3e50;
      }

      .stat-label {
        display: block;
        margin-top: 0.5rem;
        color: #7f8c8d;
        font-size: 0.9rem;
      }
    }

    .conventions-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .convention-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ref-section {
        h3 { margin: 0; color: #2c3e50; }
        .partner-name { 
          display: block;
          margin-top: 0.25rem;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
      }

      .validation-badge {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
        background: #f39c12;
        color: white;
      }
    }

    .card-body {
      padding: 1.5rem;

      .info-row {
        margin-bottom: 0.75rem;
        color: #2c3e50;

        strong { color: #003566; }
      }
    }

    .validation-progress {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;

      .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        &.completed {
          .step-icon { 
            background: #27ae60;
            color: white;
          }
          .step-label { color: #27ae60; font-weight: 600; }
        }

        .step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e0e0e0;
          color: #7f8c8d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .step-label {
          font-size: 0.75rem;
          color: #7f8c8d;
        }
      }

      .progress-line {
        flex: 1;
        height: 2px;
        background: #e0e0e0;
        margin: 0 0.5rem;
        margin-bottom: 1.5rem;
      }
    }

    .card-actions {
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-secondary, .btn-reject, .btn-approve {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #ddd;
      color: #7f8c8d;

      &:hover { background: #f5f5f5; }
    }

    .btn-reject {
      background: #e74c3c;
      color: white;

      &:hover { background: #c0392b; }
    }

    .btn-approve {
      background: #27ae60;
      color: white;

      &:hover { background: #229954; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 8px;

      .empty-icon {
        font-size: 4rem;
        color: #27ae60;
        margin-bottom: 1rem;
      }

      h3 { color: #2c3e50; }
      p { color: #7f8c8d; }
    }

    /* MODAL */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 { margin: 0; color: #2c3e50; }

      .btn-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #7f8c8d;
        cursor: pointer;
        line-height: 1;

        &:hover { color: #2c3e50; }
      }
    }

    .modal-body {
      padding: 1.5rem;

      .convention-info {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
        margin-bottom: 1.5rem;

        strong { color: #003566; display: block; }
        p { margin: 0.5rem 0 0 0; color: #7f8c8d; }
      }

      .form-group {
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          resize: vertical;

          &:focus {
            outline: none;
            border-color: #003566;
          }
        }
      }
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-cancel, .btn-submit {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: white;
      border: 1px solid #ddd;
      color: #7f8c8d;

      &:hover { background: #f5f5f5; }
    }

    .btn-submit {
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `]
})
export class ValidationDashboardComponent implements OnInit {
  pendingConventions: Convention[] = [];
  userRole: string = '';
  
  showModal = false;
  selectedConvention?: Convention;
  validationAction: 'APPROVED' | 'REJECTED' = 'APPROVED';
  validationComment = '';
  isSubmitting = false;

  constructor(
    private conventionsService: ConventionsService,
    private workflowService: WorkflowService,
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole() || '';
    this.loadPendingConventions();
  }

  loadPendingConventions() {
    if (!this.userRole) return;

    this.workflowService.getPendingValidations(this.userRole).subscribe({
      next: (data: Convention[]) => {
        this.pendingConventions = data;
      },
      error: (err: any) => console.error('Erreur chargement conventions:', err)
    });
  }

  getValidationLabel(status?: string): string {
    const labels: {[key: string]: string} = {
      'PENDING_SRECIP': 'En attente SRECIP',
      'PENDING_DFC': 'En attente DFC',
      'PENDING_CAQ': 'En attente CAQ',
      'PENDING_DG': 'En attente DG',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée'
    };
    return labels[status || ''] || status || '';
  }

  openValidationModal(convention: Convention, action: 'APPROVED' | 'REJECTED') {
    this.selectedConvention = convention;
    this.validationAction = action;
    this.validationComment = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedConvention = undefined;
    this.validationComment = '';
  }

  submitValidation() {
    if (!this.selectedConvention) return;
    if (this.validationAction === 'REJECTED' && !this.validationComment) return;

    this.isSubmitting = true;

    this.workflowService.validateConvention(
      this.selectedConvention.id,
      this.validationAction,
      this.validationComment
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadPendingConventions();
      },
      error: (err: any) => {
        console.error('Erreur validation:', err);
        this.isSubmitting = false;
        alert('Erreur lors de la validation');
      }
    });
  }

  viewDetails(convention: Convention) {
    // Navigate to convention detail page
    console.log('View details:', convention.id);
  }
}
