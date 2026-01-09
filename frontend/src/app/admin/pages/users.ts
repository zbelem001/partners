import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  
  users: User[] = [];
  showModal = false;
  isEditing = false;
  currentUserId: string | null = null;

  notificationMessage: string | null = null;
  isLoading = false;
  
  departments = [
    'RECIP',
    'Direction émettrice',
    'SRECIP',
    'DFC',
    'CAQ',
    'DG'
  ];
  
  suggestedEmails: string[] = [];

  newUser = {
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'User',
    department: '',
    password: 'BZ2026P00'
  };

  constructor(private usersService: UsersService) {}

  updateEmailSuggestion() {
    this.suggestedEmails = [];
    if (this.newUser.lastName && this.newUser.firstName) {
      const nom = this.newUser.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const prenom = this.newUser.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (nom && prenom) {
        this.suggestedEmails.push(`${nom}.${prenom}@2ie-edu.org`);
      }
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.findAll().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentUserId = null;
    // Reset form
    this.newUser = {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'User',
      department: '',
      password: 'BZ2026P00'
    };
  }

  editUser(user: User) {
    this.isEditing = true;
    this.currentUserId = user.id;
    this.showModal = true;
    
    // Copy user data to form model
    // Note: We don't load the password, users must reset it if needed
    this.newUser = {
      employeeId: user.employeeId || '',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department || '',
      password: '' // Clear password for edit mode (leave empty = no change)
    };
    this.updateEmailSuggestion();
  }

  saveUser() {
    this.isLoading = true;
    
    if (this.isEditing && this.currentUserId) {
      // Logic for Update
      const updateData = { ...this.newUser };
      // If password is empty string, remove it so we don't overwrite with empty string
      if (!updateData.password) {
        delete (updateData as any).password;
      }

      this.usersService.update(this.currentUserId, updateData).subscribe({
        next: (updatedUser) => {
          // Update the list locally
          const index = this.users.findIndex(u => u.id === this.currentUserId);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.isLoading = false;
          this.showNotification('Utilisateur modifié avec succès');
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error updating user', err);
          alert('Erreur lors de la modification de l\'utilisateur.');
        }
      });

    } else {
      // Logic for Create (Existing code mostly)
      this.usersService.create(this.newUser).subscribe({
        next: (user) => {
          this.users.push(user);
          this.isLoading = false;
          this.showNotification('Utilisateur créé avec succès');
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error creating user', err);
          alert('Erreur lors de la création de l\'utilisateur.');
        }
      });
    }
  }

  showNotification(message: string) {
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }

  getRoleBadge(role: string): string {
    switch(role) {
      case 'Admin': return 'badge-purple';
      case 'Direction': return 'badge-red';
      case 'Manager': return 'badge-blue';
      default: return 'badge-gray';
    }
  }

  deleteUser(id: string) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.isLoading = true;
      this.usersService.delete(id).subscribe(() => {
        this.loadUsers();
        this.isLoading = false;
        this.showNotification('Utilisateur supprimé avec succès');
      });
    }
  }
}
