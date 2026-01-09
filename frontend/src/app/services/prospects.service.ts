import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prospect {
  id: string;
  reference: string;
  companyName: string;
  type: string;
  sector: string;
  country: string;
  contactName: string;
  email: string;
  phone?: string;
  projectDescription?: string;
  status: string;
  submissionDate?: string;
  reviewNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProspectsService {
  private apiUrl = 'http://localhost:3000/prospects';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Prospect> {
    return this.http.get<Prospect>(`${this.apiUrl}/${id}`);
  }

  create(prospect: Partial<Prospect>): Observable<Prospect> {
    return this.http.post<Prospect>(this.apiUrl, prospect);
  }

  update(id: string, prospect: Partial<Prospect>): Observable<Prospect> {
    return this.http.patch<Prospect>(`${this.apiUrl}/${id}`, prospect);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
