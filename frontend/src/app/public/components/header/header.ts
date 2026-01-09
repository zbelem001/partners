import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public authService: AuthService) {}

  showDashboard(role: string): boolean {
    // Show 'Dashboard' link for all internal staff
    return ['Admin', 'Manager', 'Direction', 'User', 'SRECIP', 'DFC', 'CAQ'].includes(role);
  }
}
