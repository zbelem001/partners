import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '2iE',
    bio: ''
  };

  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  isEditing = false;
  userId: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('user_role');
    
    // Fallback display from localStorage while loading
    this.user.role = role || 'User';
    this.user.firstName = (localStorage.getItem('user_name') || '').split(' ')[0];
    this.user.lastName = (localStorage.getItem('user_name') || '').split(' ').slice(1).join(' ');
    this.user.email = localStorage.getItem('user_email');

    if (this.userId) {
      this.usersService.findOne(this.userId).subscribe({
        next: (u) => {
          this.user = { 
            ...this.user, // keep defaults if fields missing
            ...u, // overwrite with API data
            role: role || u.role, 
            department: u.department || '2iE'
          };
        },
        error: (err) => console.error('Failed to load user profile', err)
      });
    }
  }
  successMessage = '';

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
  }

  saveProfile() {
    if (this.userId) {
      // Create clean object for update
      const updateData = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phone: this.user.phone,
        bio: this.user.bio,
        department: this.user.department
      };

      this.usersService.update(this.userId, updateData).subscribe({
        next: (res) => {
          this.isEditing = false;
          // Update local storage name if changed
          if(res.firstName || res.lastName) {
             localStorage.setItem('user_name', (res.firstName || '') + ' ' + (res.lastName || ''));
          }
          this.showSuccess('Profil mis à jour avec succès.');
        },
        error: (err) => {
          console.error(err);
          this.showSuccess('Erreur lors de la mise à jour.');
        }
      });
    } else {
       this.isEditing = false;
       this.showSuccess('Profil mis à jour (Local Only).');
    }
  }

  changePassword() {
    if (this.passwordForm.new !== this.passwordForm.confirm) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    // Simulate API call
    this.passwordForm = { current: '', new: '', confirm: '' };
    this.showSuccess('Mot de passe modifié avec succès.');
  }

  showSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
