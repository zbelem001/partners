import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast"
        [ngClass]="'toast-' + toast.type"
        [class.toast-removing]="toast.removing"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="remove(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 500px;
      padding: 16px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: all;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .toast.toast-removing {
      animation: slideOut 0.3s ease-in forwards;
    }

    .toast-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    }

    .toast-success {
      border-left: 4px solid #27ae60;
      
      .toast-icon {
        background: #27ae60;
        color: white;
      }
    }

    .toast-error {
      border-left: 4px solid #e74c3c;
      
      .toast-icon {
        background: #e74c3c;
        color: white;
      }
    }

    .toast-warning {
      border-left: 4px solid #f39c12;
      
      .toast-icon {
        background: #f39c12;
        color: white;
      }
    }

    .toast-info {
      border-left: 4px solid #3498db;
      
      .toast-icon {
        background: #3498db;
        color: white;
      }
    }

    .toast-message {
      flex: 1;
      color: #2c3e50;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: #7f8c8d;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      flex-shrink: 0;

      &:hover {
        color: #2c3e50;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (Toast & { removing?: boolean })[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.toasts.push({ ...toast, removing: false });
      
      // Auto-remove after duration
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration || 4000); // 4 secondes au lieu de 3
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  remove(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.removing = true;
      // Attendre la fin de l'animation avant de retirer
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 300);
    }
  }
}
