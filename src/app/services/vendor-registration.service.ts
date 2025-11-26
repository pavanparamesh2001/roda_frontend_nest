
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateVendorDto } from '../models/vendor.model';
import { CreateVendorLocationDto } from '../models/vendor-location.model';


@Injectable({
  providedIn: 'root'
})
export class VendorRegistrationService {

  // ⛳ Using direct URL because environment.ts is missing
  private baseUrl = 'http://localhost:3000'; // <-- change if needed

  constructor(private http: HttpClient) {}

  // Vendors
  createVendor(dto: CreateVendorDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendors`, dto);
  }

  getAllVendors(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined) httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.baseUrl}/vendors`, { params: httpParams });
  }

  getVendor(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendors/${id}`);
  }

  updateVendor(id: string, dto: Partial<CreateVendorDto | any>): Observable<any> {
    return this.http.put(`${this.baseUrl}/vendors/${id}`, dto);
  }

  deleteVendor(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vendors/${id}`);
  }

  // vendor location (create)
  createVendorLocation(vendorId: string, dto: CreateVendorLocationDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendors/${vendorId}/locations`, dto);
  }

  // duplicate validation
  searchVendor(query: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendors/search`, query);
  }

  // states & districts
  getStates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/states`);
  }

  getDistrictsByState(stateId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts/state/${stateId}`);
  }

  getVendorLocations(vendorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendors/${vendorId}/locations`);
  }
}

