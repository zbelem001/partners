import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  
  user = {
    firstName: 'Adama',
    lastName: 'Ouedraogo',
    email: 'adama.ouedraogo@2ie-edu.org',
    phone: '+226 70 12 34 56',
    role: 'Administrateur',
    department: 'SRECIP',
    bio: 'Responsable des partenariats et de la coopération internationale.'
  };

  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  isEditing = false;
  successMessage = '';

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
  }

  saveProfile() {
    // Simulate API call
    this.isEditing = false;
    this.showSuccess('Profil mis à jour avec succès.');
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
