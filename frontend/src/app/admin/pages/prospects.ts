import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProspectsService, Prospect } from '../../services/prospects.service';

@Component({
  selector: 'app-prospects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.scss',
})
export class ProspectsComponent implements OnInit {
  
  prospects: Prospect[] = [];

  constructor(private prospectsService: ProspectsService) {}

  ngOnInit() {
    this.loadProspects();
  }

  loadProspects() {
    this.prospectsService.findAll().subscribe({
      next: (data) => {
        this.prospects = data;
      },
      error: (err) => console.error('Error loading prospects', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'New': return 'badge-warning';
      case 'Qualified': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
  getStatusLabel(status: string): string {
     switch (status) {
      case 'New': return 'Nouveau';
      case 'Reviewed': return 'En cours';
      case 'Qualified': return 'Qualifié';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  }
}
