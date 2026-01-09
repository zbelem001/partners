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

  constructor(
    private prospectsService: ProspectsService,
    private partnersService: PartnersService,
    private conventionsService: ConventionsService
  ) {}

  ngOnInit() {
    // Use forkJoin to load all stats in parallel
    forkJoin({
      prospects: this.prospectsService.findAll(),
      partners: this.partnersService.findAll(),
      conventions: this.conventionsService.findAll()
    }).subscribe(({ prospects, partners, conventions }) => {
      
      // Calculate Stats
      const totalProspects = prospects.length;
      const pendingProspects = prospects.filter(p => p.status === 'New' || p.status === 'Pending').length;
      const rejectedProspects = prospects.filter(p => p.status === 'Rejected').length;
      const activePartners = partners.length; // Assuming all in Partners table are active

      this.stats[0].value = totalProspects;
      this.stats[1].value = pendingProspects;
      this.stats[2].value = activePartners;
      this.stats[3].value = rejectedProspects;

      // Generate Recent Activity from Prospects (using submissionDate if avail, else top of list)
      // Note: submissionDate might need to be added to Prospect interface if not present
      this.activities = prospects
        .slice(0, 5)
        .map(p => ({
          title: `Nouvelle demande - ${p.companyName}`,
          time: 'Récemment', // We need real dates for better precision
          type: this.mapStatusToType(p.status)
        }));
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
