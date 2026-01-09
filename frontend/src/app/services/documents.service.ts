import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
  id: string;
  name: string;
  type: string;
  size?: string;
  url: string;
  category?: string;
  confidentialityLevel: string;
  uploadDate: string;
  ownerId?: number;
  conventionId?: string;
  partnerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  create(doc: Partial<Document>): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, doc);
  }

  update(id: string, doc: Partial<Document>): Observable<Document> {
    return this.http.patch<Document>(`${this.apiUrl}/${id}`, doc);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
