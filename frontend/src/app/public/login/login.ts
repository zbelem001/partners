import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      employeeId: ['', [Validators.required]], 
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'success') {
        setTimeout(() => {
          this.toastService.success('Déconnexion réussie. À bientôt !');
        }, 100);
        // Nettoyer les query params après affichage
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { employeeId, password } = this.loginForm.value;
      
      this.authService.login({ email: employeeId, password }).subscribe({
        next: () => {
          this.toastService.success('Connexion réussie ! Redirection...');
        },
        error: (err) => {
          console.error('Login failed', err);
          this.toastService.error('Identifiants incorrects');
        }
      });
    }
  }
}
