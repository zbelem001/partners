import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Prospect {
  id: string;
  organization: string;
  type: string;
  contact: string;
  date: string;
  status: 'pending' | 'validated' | 'rejected' | 'draft';
}

@Component({
  selector: 'app-prospects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.scss',
})
export class ProspectsComponent {
  
  prospects: Prospect[] = [
    { id: 'P001', organization: 'Orange Burkina', type: 'Entreprise', contact: 'Jean Dupont', date: '09/01/2026', status: 'pending' },
    { id: 'P002', organization: 'ONATEL SA', type: 'Entreprise', contact: 'Aminata Diallo', date: '08/01/2026', status: 'validated' },
    { id: 'P003', organization: 'ONG Eau Vive', type: 'ONG', contact: 'Paul Smith', date: '05/01/2026', status: 'rejected' },
    { id: 'P004', organization: 'Université de Ouaga I', type: 'Academique', contact: 'Pr. Kabore', date: '03/01/2026', status: 'pending' },
    { id: 'P005', organization: 'Coris Bank', type: 'Entreprise', contact: 'Moussa Sanou', date: '02/01/2026', status: 'validated' },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'validated': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
  getStatusLabel(status: string): string {
     switch (status) {
      case 'pending': return 'En Attente';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return 'Brouillon';
    }
  }
}
