import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  message: string;
  conventionRef: string;
  date: string;
}

interface Jalon {
  id: number;
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'late';
  convention: string;
}

interface Roadmap {
  id: number;
  convention: string;
  partner: string;
  progress: number;
  nextAction: string;
  dueDate: string;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.html',
  styleUrl: './activities.scss'
})
export class ActivitiesComponent {
  
  // Alertes pour les échéances et problèmes
  alerts: Alert[] = [
    { id: 1, type: 'critical', message: 'Rapport annuel manquant', conventionRef: 'CONV-2024-042', date: 'En retard de 5 jours' },
    { id: 2, type: 'warning', message: 'Échéance de paiement tranche 2', conventionRef: 'CONV-2025-012', date: 'Dans 3 jours' },
    { id: 3, type: 'info', message: 'Renouvellement tacite approche', conventionRef: 'CONV-2023-089', date: 'Dans 1 mois' }
  ];

  // Jalons à venir (Agenda)
  jalons: Jalon[] = [
    { id: 1, title: 'Comité de Pilotage Annuel', date: '12 Jan 2026', status: 'pending', convention: 'Total Energies' },
    { id: 2, title: 'Remise des livrables Lot 1', date: '15 Jan 2026', status: 'pending', convention: 'Orange Burkina' },
    { id: 3, title: 'Visite de terrain', date: '08 Jan 2026', status: 'completed', convention: 'Mairie de Ouaga' },
    { id: 4, title: 'Validation Budget 2026', date: '05 Jan 2026', status: 'late', convention: 'Banque Mondiale' }
  ];

  // Feuilles de route actives (Suivi macro)
  roadmaps: Roadmap[] = [
    { id: 1, convention: 'Accord Cadre Recherche', partner: 'IRD', progress: 65, nextAction: 'Publication Résultats', dueDate: '20 Jan 2026' },
    { id: 2, convention: 'Programme Bourses d\'Excellence', partner: 'Fondation BOA', progress: 30, nextAction: 'Sélection Candidats', dueDate: '01 Fév 2026' },
    { id: 3, convention: 'Incubateur GreenTech', partner: 'Giz', progress: 90, nextAction: 'Clôture Projet', dueDate: '28 Fév 2026' }
  ];

  getAlertClass(type: string): string {
    switch(type) {
      case 'critical': return 'alert-critical';
      case 'warning': return 'alert-warning';
      default: return 'alert-info';
    }
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'completed': return 'badge-success'; // Vert
      case 'pending': return 'badge-blue'; // Bleu
      case 'late': return 'badge-danger'; // Rouge
      default: return 'badge-gray';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'À venir';
      case 'late': return 'En retard';
      default: return 'Inconnu';
    }
  }
}
