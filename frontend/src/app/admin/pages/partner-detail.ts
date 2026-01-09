import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PartnersService } from '../../services/partners.service';
import { ConventionsService } from '../../services/conventions.service';

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partner-detail.html',
  styleUrl: './partner-detail.scss',
})
export class PartnerDetailComponent implements OnInit {
  partner: any = null;
  activeTab: string = 'overview';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private partnersService: PartnersService,
    private conventionsService: ConventionsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPartner(id);
    }
  }

  loadPartner(id: string) {
    this.partnersService.findOne(id).subscribe({
      next: (data) => {
        console.log('[Partner Detail] Loaded:', data);
        this.partner = {
          id: data.id,
          code: data.ref,
          name: data.name,
          classification: data.type,
          status: data.status,
          logo: null,
          since: data.createdAt ? new Date(data.createdAt).toLocaleDateString('fr-FR') : 'N/A',
          generalInfo: {
            website: data.website || 'N/A',
            headquarters: data.country,
            sector: data.domain
          },
          contacts: data.email ? [
            { role: 'Contact principal', name: 'N/A', email: data.email, phone: 'N/A' }
          ] : [],
          conventions: [],
          interactions: []
        };
        this.loadConventions(id);
      },
      error: (err) => {
        console.error('[Partner Detail] Error:', err);
        alert('Erreur lors du chargement du partenaire');
        this.router.navigate(['/admin/partners']);
      }
    });
  }

  loadConventions(partnerId: string) {
    this.conventionsService.findAll().subscribe({
      next: (conventions) => {
        this.partner.conventions = conventions
          .filter((c: any) => c.partnerId === partnerId)
          .map((c: any) => ({
            id: c.id,
            title: c.ref + ' - ' + c.type,
            status: c.status,
            signDate: c.startDate ? new Date(c.startDate).toLocaleDateString('fr-FR') : '-',
            expireDate: c.endDate ? new Date(c.endDate).toLocaleDateString('fr-FR') : '-'
          }));
      },
      error: (err) => console.error('[Partner Detail] Error loading conventions:', err)
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
