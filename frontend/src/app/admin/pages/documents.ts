import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsService, Document } from '../../services/documents.service';

interface DocFolder {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

interface DocFile {
  id: string; // Changed to string for UUID
  name: string;
  type: string;
  size: string;
  date: string;
  category: string; 
  owner: string;
  level: string;
  url: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsComponent implements OnInit {
  
  folders: DocFolder[] = [
    { id: 'all', name: 'Tous les documents', count: 0, active: true },
    { id: 'modele', name: 'Modèles & Templates', count: 0, active: false },
    { id: 'signed', name: 'Conventions Signées', count: 0, active: false },
    { id: 'report', name: 'Rapports d\'Activités', count: 0, active: false },
    { id: 'legal', name: 'Documents 2iE', count: 0, active: false },
    { id: 'draft', name: 'Brouillons', count: 0, active: false }
  ];

  allFiles: DocFile[] = [];
  files: DocFile[] = []; // Changed from 'filteredFiles' to 'files' to match template likely usage

  constructor(private documentsService: DocumentsService) {}

  ngOnInit() {
    this.documentsService.findAll().subscribe(data => {
      this.allFiles = data.map(d => ({
        id: d.id,
        name: d.name,
        type: this.getFileType(d.name, d.type),
        size: d.size || 'Unknown',
        date: new Date(d.uploadDate).toLocaleDateString(),
        category: d.category || 'Non classé',
        owner: 'Admin', 
        level: d.confidentialityLevel || 'Interne',
        url: d.url
      }));

      this.updateFolderCounts();
      this.selectFolder('all');
    });
  }

  updateFolderCounts() {
    this.folders[0].count = this.allFiles.length; 
    this.folders.forEach(f => {
      if(f.id !== 'all') {
        const key = f.id.toLowerCase();
        f.count = this.allFiles.filter(d => 
          (d.category && d.category.toLowerCase().includes(key)) ||
          (d.name && d.name.toLowerCase().includes(key))
        ).length;
      }
    });
  }

  selectFolder(folderId: string) {
    this.folders.forEach(f => f.active = (f.id === folderId));
    
    if(folderId === 'all') {
      this.files = this.allFiles;
    } else {
      const key = folderId.toLowerCase();
      this.files = this.allFiles.filter(d => 
        (d.category && d.category.toLowerCase().includes(key)) ||
        (d.name && d.name.toLowerCase().includes(key))
      );
    }
  }

  getFileType(name: string, type: string): string {
    if (type && type.length < 5) return type.toUpperCase();
    if (name.toLowerCase().endsWith('.pdf')) return 'PDF';
    if (name.toLowerCase().endsWith('.doc') || name.toLowerCase().endsWith('.docx')) return 'DOC';
    if (name.toLowerCase().endsWith('.xls') || name.toLowerCase().endsWith('.xlsx')) return 'XLS';
    if (name.toLowerCase().endsWith('.zip') || name.toLowerCase().endsWith('.rar')) return 'ZIP';
    if (name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.png')) return 'IMG';
    return 'FILE';
  }

  getLevelBadge(level: string): string {
    switch(level?.toLowerCase()) {
      case 'confidentiel': return 'badge-red';
      case 'interne': return 'badge-blue';
      case 'public': return 'badge-green';
      default: return 'badge-blue';
    }
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'PDF': return 'red-icon';
      case 'DOC': return 'blue-icon';
      case 'XLS': return 'green-icon';
      case 'IMG': return 'purple-icon';
      case 'ZIP': return 'orange-icon';
      default: return 'gray-icon';
    }
  }
}
