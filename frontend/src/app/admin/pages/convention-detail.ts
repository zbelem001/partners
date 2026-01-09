import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ConventionsService } from '../../services/conventions.service';
import { PartnersService } from '../../services/partners.service';

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
  convention: any = null;
  activeTab = 'details';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private conventionsService: ConventionsService,
    private partnersService: PartnersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadConvention(id);
    }
  }

  loadConvention(id: string) {
    this.conventionsService.findOne(id).subscribe({
      next: (data) => {
        console.log('[Convention Detail] Loaded:', data);
        this.convention = {
          id: data.id,
          ref: data.ref,
          partnerName: 'Chargement...',
          partnerId: data.partnerId,
          type: data.type,
          status: data.status,
          startDate: data.startDate ? new Date(data.startDate).toLocaleDateString('fr-FR') : 'N/A',
          endDate: data.endDate ? new Date(data.endDate).toLocaleDateString('fr-FR') : 'N/A',
          description: data.objectives || 'Aucune description',
          objectives: data.objectives || 'Aucun objectif défini',
          workflow: {
            currentStep: 0,
            steps: []
          },
          partenariats: []
        };
        
        if (data.partnerId) {
          this.loadPartner(data.partnerId);
        }
      },
      error: (err) => {
        console.error('[Convention Detail] Error:', err);
        alert('Erreur lors du chargement de la convention');
        this.router.navigate(['/admin/conventions']);
      }
    });
  }

  loadPartner(partnerId: string) {
    this.partnersService.findOne(partnerId).subscribe({
      next: (partner) => {
        if (this.convention) {
          this.convention.partnerName = partner.name;
        }
      },
      error: (err) => console.error('[Convention Detail] Error loading partner:', err)
    });
  }
}
