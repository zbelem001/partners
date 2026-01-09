import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      employeeId: ['', [Validators.required]], 
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'success') {
        this.successMessage = 'Déconnexion réussie. À bientôt !';
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.loginForm.valid) {
      const { employeeId, password } = this.loginForm.value;
      
      this.authService.login({ email: employeeId, password }).subscribe({
        next: () => {
          // Redirect is handled in service
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Identifiants incorrects';
        }
      });
    }
  }
}
