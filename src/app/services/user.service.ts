import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/users'; // ✅ NestJS endpoint

  constructor(private http: HttpClient) {}

  // ➕ Create user
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, user);
  }

  // 📋 Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // ✏️ Update user
  updateUser(id: string, user: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, user);
  }

  // 🚫 Enable / Disable user
  toggleUserStatus(id: string, active: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, { active });
  }

  // ❌ Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
