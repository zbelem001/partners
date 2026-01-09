import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Milestone {
  id: number;
  conventionId: string;
  title: string;
  dueDate: string;
  status: string;
  type: string;
  alertSent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {
  private apiUrl = 'http://localhost:3000/milestones';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Milestone> {
    return this.http.get<Milestone>(`${this.apiUrl}/${id}`);
  }

  create(milestone: Partial<Milestone>): Observable<Milestone> {
    return this.http.post<Milestone>(this.apiUrl, milestone);
  }

  update(id: number, milestone: Partial<Milestone>): Observable<Milestone> {
    return this.http.patch<Milestone>(`${this.apiUrl}/${id}`, milestone);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
