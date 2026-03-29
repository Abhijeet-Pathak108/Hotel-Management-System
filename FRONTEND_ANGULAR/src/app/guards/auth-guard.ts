import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // or whatever you store after login

    if (token) {
      return true;        // ✅ allow access to dashboard
    } else {
      this.router.navigate(['/']);  // ❌ redirect to landing page
      return false;
    }
  }
}