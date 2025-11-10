import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private baseUrl = 'http://localhost:3000/issues';

  constructor(private http: HttpClient) {}

  /** Create Issue */
  createIssue(data: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (imageFile) formData.append('image', imageFile);
    return this.http.post(this.baseUrl, formData);
  }

  /** Get Issues (with search & pagination) */
  getAllIssues(page = 1, limit = 5, search = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);
    return this.http.get(this.baseUrl, { params });
  }

  /** Update Issue */
  updateIssue(id: string, data: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (imageFile) formData.append('image', imageFile);
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  /** Delete Issue */
  deleteIssue(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

