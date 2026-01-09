import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Partner {
  id: string;
  code: string;
  name: string;
  classification: 'Stratégique' | 'Opérationnel' | 'Académique';
  status: 'Actif' | 'Nouveau' | 'Inactif';
  country: string;
  startDate: string;
}

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partners.html',
  styleUrl: './partners.scss',
})
export class PartnersComponent {
  partners: Partner[] = [
    { id: '1', code: 'P-2024-042', name: 'TotalEnergies', classification: 'Stratégique', status: 'Actif', country: 'France', startDate: '12/03/2024' },
    { id: '2', code: 'P-2024-055', name: 'ONEA', classification: 'Opérationnel', status: 'Actif', country: 'Burkina Faso', startDate: '04/05/2024' },
    { id: '3', code: 'P-2025-001', name: 'Université de Liège', classification: 'Académique', status: 'Nouveau', country: 'Belgique', startDate: '02/01/2025' },
    { id: '4', code: 'P-2023-089', name: 'SONABEL', classification: 'Opérationnel', status: 'Inactif', country: 'Burkina Faso', startDate: '15/11/2023' },
  ];

  getClassificationBadge(type: string): string {
    switch(type) {
      case 'Stratégique': return 'badge-purple';
      case 'Opérationnel': return 'badge-blue';
      case 'Académique': return 'badge-orange';
      default: return 'badge-gray';
    }
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'Actif': return 'badge-success';
      case 'Nouveau': return 'badge-info';
      case 'Inactif': return 'badge-gray';
      default: return 'badge-gray';
    }
  }
}
