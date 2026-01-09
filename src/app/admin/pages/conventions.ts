import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Convention {
  id: string;
  ref: string;
  partnerName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Négociation' | 'En signature' | 'Active' | 'Terminée';
  progress: number;
}

@Component({
  selector: 'app-conventions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conventions.html',
  styleUrl: './conventions.scss',
})
export class ConventionsComponent {
  conventions: Convention[] = [
    { id: '1', ref: 'C-2026-001', partnerName: 'TotalEnergies', type: 'Accord Cadre', startDate: '01/02/2026', endDate: '01/02/2030', status: 'Draft', progress: 10 },
    { id: '2', ref: 'C-2025-089', partnerName: 'ONEA', type: 'Accord Spécifique', startDate: '15/12/2025', endDate: '15/12/2026', status: 'En signature', progress: 80 },
    { id: '3', ref: 'C-2024-042', partnerName: 'Université de Liège', type: 'Mémorandum (MoU)', startDate: '10/06/2024', endDate: '10/06/2029', status: 'Active', progress: 100 },
    { id: '4', ref: 'C-2026-003', partnerName: 'Orange Burkina', type: 'Accord Cadre', startDate: '-', endDate: '-', status: 'Négociation', progress: 40 },
  ];

  getStatusBadge(status: string): string {
    switch(status) {
      case 'Draft': return 'badge-gray';
      case 'Négociation': return 'badge-warning';
      case 'En signature': return 'badge-blue';
      case 'Active': return 'badge-success';
      case 'Terminée': return 'badge-dark';
      default: return '';
    }
  }
}
