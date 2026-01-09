import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Direction' | 'Manager' | 'Viewer';
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent {
  
  users: User[] = [
    { id: 1, name: 'Adama Ouedraogo', email: 'adama.ouedraogo@2ie-edu.org', role: 'Admin', department: 'SRECIP', status: 'Active', lastLogin: '09 Jan 2026 08:30' },
    { id: 2, name: 'Sarah Koné', email: 'sarah.kone@2ie-edu.org', role: 'Direction', department: 'Direction Générale', status: 'Active', lastLogin: '08 Jan 2026 14:15' },
    { id: 3, name: 'Jean-Pierre Kabore', email: 'jp.kabore@2ie-edu.org', role: 'Manager', department: 'Direction Scientifique', status: 'Active', lastLogin: '09 Jan 2026 09:45' },
    { id: 4, name: 'Aminata Diallo', email: 'aminata.diallo@2ie-edu.org', role: 'Manager', department: 'Formation Continue', status: 'Inactive', lastLogin: '15 Déc 2025' },
    { id: 5, name: 'Michel Zongo', email: 'michel.zongo@2ie-edu.org', role: 'Viewer', department: 'Comptabilité', status: 'Active', lastLogin: '09 Jan 2026 10:00' }
  ];

  getRoleBadge(role: string): string {
    switch(role) {
      case 'Admin': return 'badge-purple';
      case 'Direction': return 'badge-red';
      case 'Manager': return 'badge-blue';
      default: return 'badge-gray';
    }
  }

  deleteUser(id: number) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }
}
