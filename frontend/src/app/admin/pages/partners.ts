import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartnersService, Partner } from '../../services/partners.service';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partners.html',
  styleUrl: './partners.scss',
})
export class PartnersComponent implements OnInit {
  partners: Partner[] = [];

  constructor(private partnersService: PartnersService) {}

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.partnersService.findAll().subscribe({
      next: (data) => this.partners = data,
      error: (err) => console.error(err)
    });
  }

  getClassificationBadge(type: string): string {
    // You might need to adjust logic based on your specific types if they differ
    return 'badge-blue'; 
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'Active': return 'badge-success';
      case 'Inactive': return 'badge-gray';
      default: return 'badge-info';
    }
  }
}
