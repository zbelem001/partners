import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService, Project } from '../../services/projects.service';
import { MilestonesService, Milestone } from '../../services/milestones.service';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.html',
  styleUrl: './activities.scss'
})
export class ActivitiesComponent implements OnInit {
  projects: Project[] = [];
  milestones: Milestone[] = [];
  
  // Computed for template
  alerts: any[] = [];
  roadmaps: any[] = [];
  jalons: any[] = [];

  constructor(
    private projectsService: ProjectsService,
    private milestonesService: MilestonesService
  ) {}

  ngOnInit() {
    this.projectsService.findAll().subscribe(data => {
      this.projects = data;
      this.roadmaps = this.projects.map(p => ({
        convention: p.title, // Fixed from p.name to p.title
        partner: 'Partenaire', 
        progress: p.progress || 0, // Fixed from context if property name differed
        nextAction: p.status,
        dueDate: p.endDate
      }));
    });

    this.milestonesService.findAll().subscribe(data => {
      this.milestones = data;
      this.jalons = this.milestones.map(m => {
        const d = new Date(m.dueDate);
        const day = d.getDate();
        const month = d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase();
        return {
          title: m.title,
          date: `${day} ${month}`, 
          status: m.status, 
          convention: 'Con. ' + (m.conventionId ? m.conventionId.substring(0, 8) : '...') + '...'
        };
      });

      this.alerts = this.milestones.filter(m => m.status === 'Pending').map(m => ({
        type: 'warning',
        message: 'Jalon en attente : ' + m.title,
        conventionRef: (m.conventionId ? m.conventionId.substring(0, 8) : '...'),
        date: new Date(m.dueDate).toLocaleDateString()
      }));
    });
  }

  getAlertClass(type: string): string {
    return 'alert-' + type;
  }

  getStatusBadge(status: string): string {
    switch(status?.toLowerCase()) {
      case 'planned': return 'badge-info';
      case 'pending': return 'badge-warning';
      case 'ongoing': return 'badge-primary';
      case 'completed': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getStatusLabel(status: string): string {
    return status || 'Inconnu';
  }
}
