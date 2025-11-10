// src/app/admin/company/company.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = 'http://localhost:3000/companies'; // adjust backend URL if needed

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<{ data: { companies: Company[] } }> {
    return this.http.get<{ data: { companies: Company[] } }>(this.baseUrl);
  }

  addCompany(company: Company): Observable<any> {
    return this.http.post(this.baseUrl, company);
  }

  updateCompany(id: string, company: Company): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, company);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
