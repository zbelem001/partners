import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage() {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      return {
        name: sessionStorage.getItem('user_name'),
        role: sessionStorage.getItem('user_role'),
        email: sessionStorage.getItem('user_email')
      };
    }
    return null;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          sessionStorage.setItem('access_token', response.access_token);
          sessionStorage.setItem('user_role', response.user.role || 'User');
          const fullName = (response.user.firstName || '') + ' ' + (response.user.lastName || '');
          sessionStorage.setItem('user_name', fullName);
          sessionStorage.setItem('user_email', response.user.email || '');
          sessionStorage.setItem('user_id', response.user.id || '');
          
          this.currentUserSubject.next({
            name: fullName,
            role: response.user.role || 'User',
            email: response.user.email
          });

          this.redirectBasedOnRole(response.user.role);
        }
      })
    );
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear(); // Safety clear in case old data exists
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { queryParams: { logout: 'success' } });
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value; // Use subject value for sync
  }

  getUserName(): string | null {
    return this.currentUserSubject.value?.name || null;
  }

  getCurrentUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  private redirectBasedOnRole(role: string) {
    if (['Admin', 'Manager', 'Direction'].includes(role)) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      // Role 'User' (Personnel) or others -> Public Interface
      this.router.navigate(['/']);
    }
  }
}
