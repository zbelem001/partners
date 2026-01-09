import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convention {
  id: string;
  ref: string;
  partnerId: string;
  type: string;
  objectives?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConventionsService {
  private apiUrl = 'http://localhost:3000/conventions';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Convention> {
    return this.http.get<Convention>(`${this.apiUrl}/${id}`);
  }

  create(convention: Partial<Convention>): Observable<Convention> {
    return this.http.post<Convention>(this.apiUrl, convention);
  }

  update(id: string, convention: Partial<Convention>): Observable<Convention> {
    return this.http.patch<Convention>(`${this.apiUrl}/${id}`, convention);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
