import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

interface Partenariat {
  id: string;
  title: string;
  domain: string;
  budget: string;
  status: 'En cours' | 'Planifié' | 'Terminé';
}

@Component({
  selector: 'app-convention-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './convention-detail.html',
  styleUrl: './convention-detail.scss',
})
export class ConventionDetailComponent implements OnInit {
  convention: any;
  activeTab = 'details';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Simulated data fetching
    this.convention = {
      id: id,
      ref: 'C-2026-001',
      partnerName: 'TotalEnergies',
      partnerId: '1',
      type: 'Accord Cadre',
      status: 'Active',
      startDate: '01/02/2026',
      endDate: '01/02/2030',
      description: 'Partenariat stratégique global incluant formation, recherche et insertion professionnelle.',
      objectives: 'Renforcer les capacités techniques des étudiants et développer des solutions énergétiques durables.',
      workflow: {
        currentStep: 4,
        steps: [
          { label: 'Draft', date: '10/01/2026', status: 'completed' },
          { label: 'Validation RECIP', date: '15/01/2026', status: 'completed' },
          { label: 'Validation Partenaire', date: '20/01/2026', status: 'completed' },
          { label: 'Signatures', date: '01/02/2026', status: 'completed' },
          { label: 'Archivage', date: '-', status: 'current' }
        ]
      },
      // The 1-N relation: One Convention -> Many Partenariats (Projects/Actions)
      partenariats: [
        { id: 'P1', title: 'Programme Bourses d\'Excellence', domain: 'Formation', budget: '50M FCFA', status: 'En cours' },
        { id: 'P2', title: 'Laboratoire Solaire Hybride', domain: 'Recherche & Innovation', budget: '120M FCFA', status: 'Planifié' },
        { id: 'P3', title: 'Stages & Insertion 2026', domain: 'Employabilité', budget: 'N/A', status: 'En cours' }
      ]
    };
  }
}
