import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentsService, Document } from '../../services/documents.service';
import { ToastService } from '../../services/toast.service';

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
  imports: [CommonModule, FormsModule],
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
  files: DocFile[] = [];

  // Upload modal state
  showUploadModal = false;
  selectedFile: File | null = null;
  uploadCategory = '';
  uploadConfidentiality = 'Interne';
  uploadDescription = '';
  isUploading = false;
  uploadProgress = 0;
  isDragOver = false;

  constructor(
    private documentsService: DocumentsService,
    private toastService: ToastService
  ) {}

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

  // Upload modal methods
  openUploadModal() {
    this.showUploadModal = true;
    this.resetUploadForm();
  }

  closeUploadModal() {
    if (!this.isUploading) {
      this.showUploadModal = false;
      this.resetUploadForm();
    }
  }

  resetUploadForm() {
    this.selectedFile = null;
    this.uploadCategory = '';
    this.uploadConfidentiality = 'Interne';
    this.uploadDescription = '';
    this.uploadProgress = 0;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      this.toastService.error('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.toastService.error('Type de fichier non supporté');
      return;
    }

    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  uploadFile() {
    if (!this.selectedFile || !this.uploadCategory) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('category', this.uploadCategory);
    formData.append('confidentialityLevel', this.uploadConfidentiality);
    formData.append('description', this.uploadDescription);

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 90) {
        clearInterval(interval);
      }
    }, 200);

    this.documentsService.upload(formData).subscribe({
      next: () => {
        clearInterval(interval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.isUploading = false;
          this.toastService.success('Document uploadé avec succès');
          this.closeUploadModal();
          this.ngOnInit(); // Reload documents
        }, 500);
      },
      error: (err: any) => {
        clearInterval(interval);
        this.isUploading = false;
        this.uploadProgress = 0;
        console.error('Upload error:', err);
        this.toastService.error('Erreur lors de l\'upload du document');
      }
    });
  }
}
