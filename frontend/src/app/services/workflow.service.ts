import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ValidationHistory {
  id: string;
  conventionId: string;
  validatorRole: string;
  validatorId: string;
  validatorName: string;
  action: string;
  comment?: string;
  fromStatus: string;
  toStatus: string;
  createdAt: string;
}

export interface Convention {
  id: string;
  ref: string;
  partnerId: string;
  partnerName?: string;
  type: string;
  validationStatus?: string;
  currentValidatorRole?: string;
  objectives?: string;
  startDate?: string;
  endDate?: string;
  validatedBy?: {
    srecip?: { date: string; userId: string; userName: string };
    dfc?: { date: string; userId: string; userName: string };
    caq?: { date: string; userId: string; userName: string };
    dg?: { date: string; userId: string; userName: string };
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = `${environment.apiUrl}/conventions`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  submitForValidation(conventionId: string): Observable<Convention> {
    return this.http.post<Convention>(
      `${this.apiUrl}/${conventionId}/submit-validation`,
      {},
      { headers: this.getHeaders() }
    );
  }

  validateConvention(conventionId: string, action: string, comment?: string): Observable<Convention> {
    return this.http.post<Convention>(
      `${this.apiUrl}/${conventionId}/validate`,
      { action, comment },
      { headers: this.getHeaders() }
    );
  }

  getValidationHistory(conventionId: string): Observable<ValidationHistory[]> {
    return this.http.get<ValidationHistory[]>(
      `${this.apiUrl}/${conventionId}/validation-history`,
      { headers: this.getHeaders() }
    );
  }

  getPendingValidations(role: string): Observable<Convention[]> {
    return this.http.get<Convention[]>(
      `${this.apiUrl}/pending/${role}`,
      { headers: this.getHeaders() }
    );
  }
}
