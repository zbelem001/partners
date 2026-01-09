import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ProspectsService } from '../../services/prospects.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  currentStep = 1;
  registerForm: FormGroup;
  isSubmitting = false;
  
  steps = [
    { title: 'Structure' },
    { title: 'Contacts' },
    { title: 'Collaboration' },
    { title: 'Documents' }
  ];

  constructor(
    private fb: FormBuilder,
    private prospectsService: ProspectsService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Etape 1: Structure
      companyName: ['', Validators.required],
      type: ['', Validators.required],
      sector: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      creationYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      website: ['', Validators.pattern('https?://.+')],

      // Etape 2: Contacts
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required],

      // Etape 3: Proposition
      agreementType: ['', Validators.required],
      motivation: ['', [Validators.required, Validators.minLength(50)]],
      collaborationAreas: ['', Validators.required],
      estimatedBudget: [''],
      deadline: ['', Validators.required],

      // Etape 4: Documents
      description: [''],
      agreedToTerms: [false, Validators.requiredTrue] 
    });
  }

  getStepFields(step: number): string[] {
    const stepFields: Record<number, string[]> = {
      1: ['companyName', 'type', 'sector', 'country', 'creationYear'],
      2: ['contactName', 'email', 'phone', 'position'],
      3: ['agreementType', 'motivation', 'collaborationAreas', 'deadline'],
      4: ['agreedToTerms']
    };
    return stepFields[step] || [];
  }

  isStepValid(step: number): boolean {
    const fields = this.getStepFields(step);
    return fields.every(field => {
      const control = this.registerForm.get(field);
      return control && control.valid;
    });
  }

  markStepAsTouched(step: number) {
    const fields = this.getStepFields(step);
    fields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  nextStep() {
    // Validate current step before moving to next
    this.markStepAsTouched(this.currentStep);
    
    if (!this.isStepValid(this.currentStep)) {
      this.toastService.warning('Veuillez remplir tous les champs obligatoires avant de continuer');
      return;
    }

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
    // Mark all fields as touched to show validation errors
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      this.toastService.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.isSubmitting = true;
    const formData = {
      ...this.registerForm.value,
      status: 'pending',
      priority: 'medium',
      submissionDate: new Date().toISOString()
    };

    this.prospectsService.create(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Votre demande a été soumise avec succès. Nous vous contacterons bientôt.');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Submission error:', err);
        this.isSubmitting = false;
        this.toastService.error('Une erreur est survenue lors de la soumission');
      }
    });
  }
}
