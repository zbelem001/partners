import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  label: string;
  value: number;
  trend: string;
  type: 'primary' | 'warning' | 'success' | 'danger';
}

interface Activity {
  title: string;
  time: string;
  type: 'new' | 'validated' | 'update' | 'rejected';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  
  stats: StatCard[] = [
    { label: 'Total Demandes', value: 124, trend: '+12% ce mois', type: 'primary' },
    { label: 'En Attente', value: 18, trend: 'Nécessite action', type: 'warning' },
    { label: 'Partenariats Actifs', value: 86, trend: 'Validés', type: 'success' },
    { label: 'Refusés', value: 20, trend: 'Dossiers clos', type: 'danger' }
  ];

  activities: Activity[] = [
    { title: 'Nouvelle convention - Total Energies', time: 'Il y a 30 min', type: 'new' },
    { title: 'Validation technique - Projet Solaire', time: 'Il y a 2 heures', type: 'validated' },
    { title: 'Mise à jour dossier - Université de Ouaga', time: 'Hier, 16:45', type: 'update' },
    { title: 'Signature en attente - Mairie de Bobo', time: 'Hier, 09:15', type: 'warning' } as any
  ];

  getActivityColor(type: string): string {
    switch(type) {
      case 'new': return 'orange';
      case 'validated': return 'green';
      case 'update': return 'blue';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  }
}
