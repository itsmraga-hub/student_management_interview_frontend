import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Decode token and extract expiry date
  decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < now;
  }

  // Validate token and redirect if invalid
  validateToken(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('accessToken');
      }
      this.router.navigate(['/login']); // Redirect to login if invalid
      return false;
    }
    return true;
  }
}
