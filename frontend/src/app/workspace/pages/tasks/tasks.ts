import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionsService, Permission } from '../../../services/permissions.service';

interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'validation' | 'meeting' | 'document' | 'deadline' | 'other';
  status: 'pending' | 'in-progress' | 'completed' | 'late';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  conventionRef?: string;
  conventionId?: string;
  assignedBy?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="tasks-page">
      <div class="page-header">
        <div class="title-section">
          <h1>Mes Tâches</h1>
          <p class="subtitle">Gérez vos actions en cours et à venir</p>
        </div>
      </div>

      <!-- STATS ROW -->
      <div class="stats-row">
        <div class="stat-card pending">
          <span class="stat-value">{{ pendingTasks }}</span>
          <span class="stat-label">En attente</span>
        </div>
        <div class="stat-card progress">
          <span class="stat-value">{{ inProgressTasks }}</span>
          <span class="stat-label">En cours</span>
        </div>
        <div class="stat-card late">
          <span class="stat-value">{{ lateTasks }}</span>
          <span class="stat-label">En retard</span>
        </div>
        <div class="stat-card completed">
          <span class="stat-value">{{ completedTasks }}</span>
          <span class="stat-label">Terminées</span>
        </div>
      </div>

      <!-- FILTERS -->
      <div class="filters-bar">
        <div class="filter-tabs">
          <button 
            *ngFor="let tab of tabs"
            [class.active]="activeTab === tab.key"
            (click)="setActiveTab(tab.key)"
            class="tab-button"
          >
            {{ tab.label }} ({{ getTaskCount(tab.key) }})
          </button>
        </div>

        <div class="filter-controls">
          <select [(ngModel)]="filterPriority" (change)="applyFilters()" class="filter-select">
            <option value="">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>

          <select [(ngModel)]="sortBy" (change)="applySorting()" class="filter-select">
            <option value="due_asc">Échéance proche</option>
            <option value="due_desc">Échéance lointaine</option>
            <option value="priority">Priorité</option>
            <option value="recent">Plus récentes</option>
          </select>
        </div>
      </div>

      <!-- TASKS LIST -->
      <div class="tasks-list" *ngIf="filteredTasks.length > 0; else noTasks">
        <div 
          *ngFor="let task of filteredTasks" 
          class="task-card"
          [class.late]="task.status === 'late'"
          [class.completed]="task.status === 'completed'"
        >
          <div class="task-left">
            <div 
              class="task-checkbox"
              [class.checked]="task.status === 'completed'"
              (click)="toggleTaskStatus(task)"
            >
              <span *ngIf="task.status === 'completed'">✓</span>
            </div>
          </div>

          <div class="task-main">
            <div class="task-header">
              <div class="task-title-section">
                <h3 class="task-title">{{ task.title }}</h3>
                <span class="task-type" [ngClass]="'type-' + task.type">
                  {{ getTypeLabel(task.type) }}
                </span>
                <span class="priority-badge" [ngClass]="'priority-' + task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
              
              <div class="task-actions">
                <button class="btn-action" (click)="viewDetails(task)">
                  Détails
                </button>
              </div>
            </div>

            <p class="task-description">{{ task.description }}</p>

            <div class="task-meta">
              <div class="meta-item" *ngIf="task.conventionRef">
                <span class="meta-label">Convention:</span>
                <a 
                  [routerLink]="['/workspace/conventions', task.conventionId]"
                  class="meta-link"
                >
                  {{ task.conventionRef }}
                </a>
              </div>

              <div class="meta-item">
                <span class="meta-label">Échéance:</span>
                <span 
                  class="meta-value due-date"
                  [ngClass]="getDueDateClass(task.dueDate, task.status)"
                >
                  {{ task.dueDate | date: 'dd/MM/yyyy HH:mm' }} 
                  ({{ getTimeRemaining(task.dueDate) }})
                </span>
              </div>

              <div class="meta-item" *ngIf="task.assignedBy">
                <span class="meta-label">Assignée par:</span>
                <span class="meta-value">{{ task.assignedBy }}</span>
              </div>
            </div>
          </div>

          <div class="task-right">
            <button 
              *ngIf="task.status !== 'completed'"
              class="btn-start"
              (click)="startTask(task)"
            >
              {{ task.status === 'in-progress' ? 'En cours...' : 'Démarrer' }}
            </button>
          </div>
        </div>
      </div>

      <ng-template #noTasks>
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>{{ getEmptyMessage() }}</h3>
          <p>{{ getEmptySubMessage() }}</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .tasks-page {
      padding: 1rem 0;
    }

    .page-header {
      margin-bottom: 2rem;

      .title-section {
        h1 { margin: 0; font-size: 1.8rem; color: #2c3e50; }
        .subtitle { margin: 0.5rem 0 0 0; color: #7f8c8d; }
      }
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.25rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border-left: 4px solid #95a5a6;

      &.pending { border-left-color: #3498db; }
      &.progress { border-left-color: #f39c12; }
      &.late { border-left-color: #e74c3c; }
      &.completed { border-left-color: #27ae60; }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #2c3e50;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.85rem;
        color: #7f8c8d;
        margin-top: 0.5rem;
      }
    }

    .filters-bar {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #eef2f6;

      .tab-button {
        background: none;
        border: none;
        padding: 0.75rem 1.25rem;
        cursor: pointer;
        color: #7f8c8d;
        font-size: 0.9rem;
        font-weight: 500;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
        transition: all 0.2s;

        &:hover { color: #003566; }

        &.active {
          color: #003566;
          border-bottom-color: #003566;
          font-weight: 600;
        }
      }
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
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

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #eef2f6;
      border-left: 4px solid #3498db;
      transition: all 0.2s;

      &.late { border-left-color: #e74c3c; }
      &.completed { 
        border-left-color: #27ae60; 
        opacity: 0.7;
      }

      &:hover {
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      }
    }

    .task-left {
      .task-checkbox {
        width: 24px;
        height: 24px;
        border: 2px solid #bdc3c7;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        &:hover { border-color: #27ae60; }

        &.checked {
          background: #27ae60;
          border-color: #27ae60;
          color: white;
        }
      }
    }

    .task-main {
      flex: 1;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .task-title-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;

      .task-title {
        margin: 0;
        font-size: 1.1rem;
        color: #2c3e50;
        font-weight: 600;
      }

      .task-type {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;

        &.type-validation { background: #e3f2fd; color: #1565c0; }
        &.type-meeting { background: #f3e5f5; color: #7b1fa2; }
        &.type-document { background: #fff3e0; color: #e65100; }
        &.type-deadline { background: #ffebee; color: #c62828; }
        &.type-other { background: #f5f5f5; color: #616161; }
      }

      .priority-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;

        &.priority-urgent { background: #ffebee; color: #c62828; }
        &.priority-high { background: #fff3e0; color: #e65100; }
        &.priority-medium { background: #fff9c4; color: #f57f17; }
        &.priority-low { background: #e0f2f1; color: #00695c; }
      }
    }

    .task-actions {
      .btn-action {
        padding: 0.5rem 1rem;
        background: white;
        color: #003566;
        border: 1px solid #003566;
        border-radius: 4px;
        font-size: 0.85rem;
        cursor: pointer;

        &:hover {
          background: #003566;
          color: white;
        }
      }
    }

    .task-description {
      margin: 0 0 1rem 0;
      color: #5d6d7e;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;

      .meta-label {
        color: #95a5a6;
        font-weight: 500;
      }

      .meta-value {
        color: #2c3e50;
        font-weight: 600;
      }

      .meta-link {
        color: #003566;
        text-decoration: none;
        font-weight: 600;

        &:hover { text-decoration: underline; }
      }

      .due-date {
        &.urgent { color: #e74c3c; }
        &.warning { color: #f39c12; }
        &.ok { color: #27ae60; }
      }
    }

    .task-right {
      .btn-start {
        padding: 0.75rem 1.5rem;
        background: #27ae60;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;

        &:hover { background: #229954; }
      }
    }

    .empty-state {
      background: white;
      padding: 4rem 2rem;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      p {
        color: #7f8c8d;
      }
    }
  `]
})
export class MyTasksComponent implements OnInit {
  Permission = Permission;
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  activeTab: string = 'all';
  filterPriority: string = '';
  sortBy: string = 'due_asc';
  
  pendingTasks = 0;
  inProgressTasks = 0;
  lateTasks = 0;
  completedTasks = 0;

  tabs = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'in-progress', label: 'En cours' },
    { key: 'late', label: 'En retard' },
    { key: 'completed', label: 'Terminées' }
  ];

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    // Load user's assigned tasks from API
    this.tasksService.findMyTasks().subscribe({
      next: (data) => {
        this.tasks = data.map(task => ({
          ...task,
          type: task.type as any,
          status: task.status as any,
          priority: task.priority as any
        }));
        this.calculateStats();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur chargement tâches:', err);
        // Fallback to demo data if API fails
        this.tasks = [];
        this.calculateStats();
        this.applyFilters();
      }
    });
  }

  calculateStats() {
    this.pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
    this.inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
    this.lateTasks = this.tasks.filter(t => t.status === 'late').length;
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchTab = this.activeTab === 'all' || task.status === this.activeTab;
      const matchPriority = !this.filterPriority || task.priority === this.filterPriority;
      
      return matchTab && matchPriority;
    });
    
    this.applySorting();
  }

  applySorting() {
    switch(this.sortBy) {
      case 'due_asc':
        this.filteredTasks.sort((a, b) => 
          new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
        );
        break;
      case 'due_desc':
        this.filteredTasks.sort((a, b) => 
          new Date(b.dueDate || '').getTime() - new Date(a.dueDate || '').getTime()
        );
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        this.filteredTasks.sort((a, b) => 
          priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case 'recent':
        this.filteredTasks.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        break;
    }
  }

  getTaskCount(tab: string): number {
    if (tab === 'all') return this.tasks.length;
    return this.tasks.filter(t => t.status === tab).length;
  }

  getTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      validation: 'Validation',
      meeting: 'Réunion',
      document: 'Document',
      deadline: 'Échéance',
      other: 'Autre'
    };
    return labels[type] || type;
  }

  getPriorityLabel(priority: string): string {
    const labels: {[key: string]: string} = {
      urgent: 'Urgent',
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    };
    return labels[priority] || priority;
  }

  getTimeRemaining(dueDate?: string): string {
    if (!dueDate) return 'Date non définie';
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffDays < 0) return `En retard de ${Math.abs(diffDays)} jours`;
    if (diffDays === 0) return `Aujourd'hui`;
    if (diffDays === 1) return `Demain`;
    if (diffDays <= 7) return `Dans ${diffDays} jours`;
    if (diffHours <= 48) return `Dans ${diffHours}h`;
    return `Dans ${diffDays} jours`;
  }

  getDueDateClass(dueDate?: string, status?: string): string {
    if (status === 'completed') return 'ok';
    if (!dueDate) return 'unknown';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'ok';
  }

  toggleTaskStatus(task: Task) {
    if (task.status === 'completed') {
      task.status = 'pending';
    } else {
      task.status = 'completed';
    }
    this.calculateStats();
  }

  startTask(task: Task) {
    if (task.status === 'pending') {
      task.status = 'in-progress';
      this.calculateStats();
    }
  }

  viewDetails(task: Task) {
    // TODO: Ouvrir modal ou navigation vers détails
    console.log('View task details:', task.id);
  }

  getEmptyMessage(): string {
    switch(this.activeTab) {
      case 'pending': return 'Aucune tâche en attente';
      case 'in-progress': return 'Aucune tâche en cours';
      case 'late': return 'Aucune tâche en retard';
      case 'completed': return 'Aucune tâche terminée';
      default: return 'Aucune tâche assignée';
    }
  }

  getEmptySubMessage(): string {
    switch(this.activeTab) {
      case 'completed': return 'Terminez des tâches pour les voir ici';
      case 'late': return 'Excellent ! Continuez comme ça';
      default: return 'Les tâches qui vous seront assignées apparaîtront ici';
    }
  }
}
