import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConventionsService, Convention } from '../../services/conventions.service';

@Component({
  selector: 'app-conventions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conventions.html',
  styleUrl: './conventions.scss',
})
export class ConventionsComponent implements OnInit {
  conventions: Convention[] = [];

  constructor(private conventionsService: ConventionsService) {}

  ngOnInit() {
    this.loadConventions();
  }

  loadConventions() {
    this.conventionsService.findAll().subscribe({
      next: (data) => this.conventions = data,
      error: (err) => console.error(err)
    });
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'Draft': return 'badge-gray';
      case 'Active': return 'badge-success';
      default: return 'badge-info';
    }
  }
}
