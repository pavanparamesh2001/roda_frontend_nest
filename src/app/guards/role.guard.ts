// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRoles = this.auth.getUserRoles();
    if (!expectedRoles || expectedRoles.length === 0) return true;

    const ok = userRoles.some((r) => expectedRoles.includes(r));
    if (!ok) {
      // optionally redirect to unauthorized page
      this.router.navigate(['/unauthorized']);
    }
    return ok;
  }
}
