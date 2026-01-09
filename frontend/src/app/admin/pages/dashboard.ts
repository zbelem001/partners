import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProspectsService } from '../../services/prospects.service';
import { PartnersService } from '../../services/partners.service';
import { ConventionsService } from '../../services/conventions.service';
import { forkJoin } from 'rxjs';

interface StatCard {
  label: string;
  value: number;
  trend: string;
  type: 'primary' | 'warning' | 'success' | 'danger';
}

interface Activity {
  title: string;
  time: string;
  type: 'new' | 'validated' | 'update' | 'rejected' | 'warning'; // Update types to match usage
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  
  stats: StatCard[] = [
    { label: 'Total Demandes', value: 0, trend: '', type: 'primary' },
    { label: 'En Attente', value: 0, trend: 'Nécessite action', type: 'warning' },
    { label: 'Partenariats Actifs', value: 0, trend: 'Validés', type: 'success' },
    { label: 'Refusés', value: 0, trend: 'Dossiers clos', type: 'danger' }
  ];

  activities: Activity[] = [];
  errorMessage: string = '';

  constructor(
    private prospectsService: ProspectsService,
    private partnersService: PartnersService,
    private conventionsService: ConventionsService
  ) {}

  ngOnInit() {
    console.log('[Dashboard] Initializing...');
    console.log('[Dashboard] API URLs:', {
      prospects: 'http://localhost:3000/prospects',
      partners: 'http://localhost:3000/partners',
      conventions: 'http://localhost:3000/conventions'
    });
    
    // Use forkJoin to load all stats in parallel
    forkJoin({
      prospects: this.prospectsService.findAll(),
      partners: this.partnersService.findAll(),
      conventions: this.conventionsService.findAll()
    }).subscribe({
      next: ({ prospects, partners, conventions }) => {
        console.log('[Dashboard] ✓ Data loaded successfully!');
        console.log('[Dashboard] Prospects:', prospects);
        console.log('[Dashboard] Partners:', partners);
        console.log('[Dashboard] Conventions:', conventions);
      
        // Calculate Stats
        const totalProspects = prospects.length;
        // Case-insensitive check for pending status
        const pendingProspects = prospects.filter(p => 
          ['new', 'pending'].includes((p.status || '').toLowerCase())
        ).length;
        
        const rejectedProspects = prospects.filter(p => 
          (p.status || '').toLowerCase() === 'rejected'
        ).length;
        
        const activePartners = partners.length; 

        this.stats[0].value = totalProspects;
        this.stats[1].value = pendingProspects;
        this.stats[2].value = activePartners;
        this.stats[3].value = rejectedProspects;

        // Generate Recent Activity
        this.activities = prospects
          .slice(0, 5)
          .map(p => ({
            title: `Nouvelle demande - ${p.companyName}`,
            time: p.submissionDate ? new Date(p.submissionDate).toLocaleDateString() : 'Récemment',
            type: this.mapStatusToType(p.status)
          }));
      },
      error: (err) => {
        console.error('[Dashboard] ✗ Error loading data:', err);
        console.error('[Dashboard] Error details:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.errorMessage = `Erreur de connexion: ${err.status || 'Serveur inaccessible'}. Vérifiez que le backend est démarré sur http://localhost:3000`;
      }
    });
  }

  mapStatusToType(status: string): 'new' | 'validated' | 'update' | 'rejected' | 'warning' {
    switch((status || '').toLowerCase()) {
      case 'new': return 'new';
      case 'validated': return 'validated';
      case 'rejected': return 'rejected';
      case 'pending': return 'warning';
      default: return 'update';
    }
  }

  getActivityColor(type: string): string {
    switch(type) {
      case 'new': return 'orange';
      case 'validated': return 'green';
      case 'update': return 'blue';
      case 'rejected': return 'red';
      case 'warning': return 'orange'; // handled similar to new
      default: return 'gray';
    }
  }
}
