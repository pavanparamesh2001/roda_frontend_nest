import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private stateUrl = 'http://localhost:3000/states';
  private districtUrl = 'http://localhost:3000/districts';

  constructor(private http: HttpClient) {}

  // 🟢 STATE CRUD OPERATIONS
  getAllStates(): Observable<any> {
    return this.http.get(this.stateUrl);
  }

  createState(data: any): Observable<any> {
    return this.http.post(this.stateUrl, data);
  }

  updateState(id: string, data: any): Observable<any> {
    return this.http.put(`${this.stateUrl}/${id}`, data);
  }

  deleteState(id: string): Observable<any> {
    return this.http.delete(`${this.stateUrl}/${id}`);
  }

  // 🟣 DISTRICT CRUD OPERATIONS
  getAllDistricts(): Observable<any> {
    return this.http.get(this.districtUrl);
  }

  getDistrictsByState(stateId: string): Observable<any> {
    return this.http.get(`${this.districtUrl}/state/${stateId}`);
  }

  createDistrict(data: any): Observable<any> {
    return this.http.post(this.districtUrl, data);
  }

  updateDistrict(id: string, data: any): Observable<any> {
    return this.http.put(`${this.districtUrl}/${id}`, data);
  }

  deleteDistrict(id: string): Observable<any> {
    return this.http.delete(`${this.districtUrl}/${id}`);
  }
}
