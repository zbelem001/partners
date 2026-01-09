import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partner-detail.html',
  styleUrl: './partner-detail.scss',
})
export class PartnerDetailComponent implements OnInit {
  partner: any;
  activeTab: string = 'overview';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Mock Data simulating a Partner fetched by ID
    this.partner = {
      id: id,
      code: 'P-2024-042',
      name: 'TotalEnergies',
      classification: 'Stratégique',
      status: 'Actif',
      logo: 'assets/logos/total.png', // Placeholder
      since: '12/03/2024',
      generalInfo: {
        website: 'www.totalenergies.com',
        headquarters: 'Paris, France',
        employeeCount: '100,000+',
        revenue: '200 Mrd €',
        sector: 'Énergie'
      },
      contacts: [
        { role: 'Directeur RSE', name: 'Jean-Pierre Dupont', email: 'jp.dupont@total.com', phone: '+33 1 23 45 67 89' },
        { role: 'Responsable Partenariats Afrique', name: 'Fatou Diop', email: 'f.diop@total.com', phone: '+221 77 000 00 00' }
      ],
      conventions: [
        { id: 'C-001', title: 'Accord Cadre 2024-2028', status: 'Active', signDate: '12/03/2024', expireDate: '12/03/2028' },
        { id: 'C-002', title: 'Avenant Financement Labo', status: 'En signature', signDate: '-', expireDate: '-' }
      ],
      interactions: [
        { date: '10/01/2026', type: 'Réunion', note: 'Point trimestriel sur le programme de bourses.' },
        { date: '15/12/2025', type: 'Email', note: 'Envoi du rapport annuel d\'activités.' }
      ]
    };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
