import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocFolder {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

interface DocFile {
  id: number;
  name: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'IMG';
  size: string;
  date: string;
  category: string; // e.g., 'Modèle', 'Contrat', 'Rapport'
  owner: string;
  level: 'Public' | 'Interne' | 'Confidentiel';
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsComponent {
  
  folders: DocFolder[] = [
    { id: 'all', name: 'Tous les documents', count: 142, active: true },
    { id: 'models', name: 'Modèles & Templates', count: 15, active: false },
    { id: 'signed', name: 'Conventions Signées', count: 86, active: false },
    { id: 'reports', name: 'Rapports d\'Activités', count: 24, active: false },
    { id: 'legal', name: 'Documents 2iE', count: 8, active: false },
    { id: 'temp', name: 'Brouillons', count: 9, active: false }
  ];

  files: DocFile[] = [
    { id: 1, name: 'Modele_Accord_Cadre_2026.docx', type: 'DOC', size: '1.2 MB', date: '05 Jan 2026', category: 'Modèle', owner: 'Service Juridique', level: 'Interne' },
    { id: 2, name: 'Convention_Total_Signee.pdf', type: 'PDF', size: '4.5 MB', date: '02 Jan 2026', category: 'Contrat', owner: 'Direction Générale', level: 'Confidentiel' },
    { id: 3, name: 'Rapport_Activite_Orange_Q4_2025.pdf', type: 'PDF', size: '2.8 MB', date: '28 Déc 2025', category: 'Rapport', owner: 'Resp. Suivi', level: 'Interne' },
    { id: 4, name: 'Statuts_2iE_V4.pdf', type: 'PDF', size: '5.1 MB', date: '10 Déc 2025', category: 'Institutionnel', owner: 'Admin', level: 'Public' },
    { id: 5, name: 'Charte_Graphique_Partenaires.zip', type: 'IMG', size: '12 MB', date: '15 Nov 2025', category: 'Média', owner: 'Com 2iE', level: 'Public' },
    { id: 6, name: 'Budget_Previsionnel_2026.xlsx', type: 'XLS', size: '850 KB', date: '20 Déc 2025', category: 'Finance', owner: 'DAF', level: 'Confidentiel' }
  ];

  currentFilter = 'all';

  selectFolder(folderId: string) {
    this.folders.forEach(f => f.active = (f.id === folderId));
    this.currentFilter = folderId;
    // Logic to filter files would go here in a real app
  }

  getLevelBadge(level: string): string {
    switch(level) {
      case 'Confidentiel': return 'badge-red';
      case 'Interne': return 'badge-blue';
      default: return 'badge-green';
    }
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'PDF': return 'red-icon';
      case 'DOC': return 'blue-icon';
      case 'XLS': return 'green-icon';
      default: return 'orange-icon';
    }
  }
}
