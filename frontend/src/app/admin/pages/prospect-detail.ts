import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProspectsService } from '../../services/prospects.service';

@Component({
  selector: 'app-prospect-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './prospect-detail.html',
  styleUrl: './prospect-detail.scss',
})
export class ProspectDetailComponent implements OnInit {
  prospect: any = null;
  showRejectModal = false;
  rejectionReason = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private prospectsService: ProspectsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProspect(id);
    }
  }

  loadProspect(id: string) {
    this.prospectsService.findOne(id).subscribe({
      next: (data) => {
        console.log('[Prospect Detail] Loaded:', data);
        this.prospect = {
          id: data.id,
          status: data.status || 'pending',
          submissionDate: data.submissionDate ? new Date(data.submissionDate).toLocaleDateString('fr-FR') : 'N/A',
          structure: {
            name: data.companyName,
            type: data.type,
            sector: data.sector,
            country: data.country,
            website: data.website,
            creationYear: data.creationYear?.toString()
          },
          contacts: {
            main: {
              name: data.contactName,
              position: data.position,
              email: data.email,
              phone: data.phone
            }
          },
          collaboration: {
            axes: data.collaborationAreas?.split(',').map((a: string) => a.trim()) || [],
            type: data.agreementType,
            project: data.description,
            deadline: data.deadline
          },
          documents: []
        };
      },
      error: (err) => {
        console.error('[Prospect Detail] Error:', err);
        alert('Erreur lors du chargement du prospect');
        this.router.navigate(['/admin/prospects']);
      }
    });
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
