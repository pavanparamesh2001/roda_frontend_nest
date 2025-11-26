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

    const hasAccess = userRoles.some(role => expectedRoles.includes(role));

    if (!hasAccess) {
      this.router.navigate(['/access-denied']);  // 👈 NEW PAGE
      return false;
    }

    return true;
  }
}
