import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-prospect-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './prospect-detail.html',
  styleUrl: './prospect-detail.scss',
})
export class ProspectDetailComponent implements OnInit {
  prospect: any;
  showRejectModal = false;
  rejectionReason = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Simulation récupération données via ID
    const id = this.route.snapshot.paramMap.get('id');
    this.prospect = {
      id: id,
      status: 'pending',
      submissionDate: '09/01/2026',
      structure: {
        name: 'Orange Burkina',
        type: 'Entreprise',
        sector: 'Télécommunications',
        country: 'Burkina Faso',
        website: 'www.orange.bf',
        creationYear: '2000'
      },
      contacts: {
        main: {
          name: 'Jean Dupont',
          position: 'Directeur RSE',
          email: 'jean.dupont@orange.bf',
          phone: '+226 70 00 00 00'
        },
        legal: {
          name: 'Aminata Ouara',
          email: 'legal@orange.bf'
        }
      },
      collaboration: {
        axes: ['Innovation', 'Stage/Emploi'],
        type: 'Accord Cadre',
        project: 'Mise en place d\'un laboratoire IoT pour les étudiants et programme de stages annuels.',
        deadline: '3-6 mois'
      },
      documents: [
        { name: 'Présentation_Orange.pdf', type: 'Présentation' },
        { name: 'Statuts.pdf', type: 'Juridique' }
      ]
    };
  }

  approve() {
    if(confirm('Êtes-vous sûr de vouloir valider ce partenaire ? Un email sera envoyé au contact principal.')) {
      alert('Dossier validé ! Le prospect devient un Partenaire.');
      this.router.navigate(['/admin/prospects']);
    }
  }

  initiateReject() {
    this.showRejectModal = true;
  }

  cancelReject() {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  confirmReject() {
    if (!this.rejectionReason.trim()) {
      alert('Merci de spécifier un motif de refus.');
      return;
    }
    alert(`Dossier rejeté pour le motif : "${this.rejectionReason}". Un email a été envoyé.`);
    this.router.navigate(['/admin/prospects']);
  }
}
