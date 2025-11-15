// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, map } from 'rxjs';

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<any>(this.getDecodedToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.api}/auth/login`, { email, password })
      .pipe(
        map((res) => {
          const token = res?.data?.accessToken;

          if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            this.currentUserSubject.next(this.getDecodedToken());
          }

          return res;
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      this.logout();
      return false;
    }

    return true;
  }

  getUserRoles(): string[] {
  const decoded = this.getDecodedToken();

  if (!decoded) return [];

  // Ensure roles is always an array
  if (Array.isArray(decoded.roles)) {
    return decoded.roles;
  }

  if (typeof decoded.roles === 'string') {
    return [decoded.roles];
  }

  return [];
}

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
