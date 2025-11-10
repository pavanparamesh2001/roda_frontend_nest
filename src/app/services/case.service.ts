import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCompanies() {
    return this.http.get(`${this.baseUrl}/companies`);
  }

  getIssues() {
    return this.http.get(`${this.baseUrl}/issues`);
  }

  getStates() {
    return this.http.get(`${this.baseUrl}/states`);
  }

  getDistrictsByState(stateId: string) {
    return this.http.get(`${this.baseUrl}/districts/state/${stateId}`);
  }

  getCaseById(id: string) {
    return this.http.get(`${this.baseUrl}/cases/${id}`);
  }

  createCase(data: any) {
    return this.http.post(`${this.baseUrl}/cases`, data);
  }

  /** ✅ Updated: Fetch cases with optional filters + pagination */
  getAllCases(
    page: number = 1,
    limit: number = 10,
    filters: any = {}
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });

    return this.http.get(`${this.baseUrl}/cases`, { params });
  }
}


