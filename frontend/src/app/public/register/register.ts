import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  currentStep = 1;
  registerForm: FormGroup;
  
  steps = [
    { title: 'Structure' },
    { title: 'Contacts' },
    { title: 'Collaboration' },
    { title: 'Documents' }
  ];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      // Etape 1: Structure
      structureName: ['', Validators.required],
      structureType: ['', Validators.required],
      sector: ['', Validators.required],
      country: ['', Validators.required],
      creationYear: ['', Validators.required],
      website: ['', Validators.pattern('https?://.+')],

      // Etape 2: Contacts
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      contactRole: ['', Validators.required],

      // Etape 3: Proposition
      interests: [[]], // Multi-select
      agreementType: ['', Validators.required],
      projectDescription: ['', Validators.required],
      estimatedBudget: [''],
      deadline: ['', Validators.required],

      // Etape 4: Documents (Handled separately for file uploads usually, but tracking here)
      hasPresentation: [false, Validators.requiredTrue] 
    });
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
      // Logic to send data to backend
    }
  }
}
