import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Partner {
  id: string;
  ref: string;
  name: string;
  type: string;
  country: string;
  domain: string;
  status: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  private apiUrl = 'http://localhost:3000/partners';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/${id}`);
  }

  create(partner: Partial<Partner>): Observable<Partner> {
    return this.http.post<Partner>(this.apiUrl, partner);
  }

  update(id: string, partner: Partial<Partner>): Observable<Partner> {
    return this.http.patch<Partner>(`${this.apiUrl}/${id}`, partner);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
