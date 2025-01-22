import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(this.validateTokenOnInit());
  authStatus$ = this.authStatus.asObservable();


  constructor(private router: Router) {}

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('accessToken');
    }
    return null;
  }

  decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  validateToken(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('accessToken');
      }
      this.router.navigate(['/login']);
      return false;
    }
    this.authStatus.next(true);
    return true;
  }

  validateTokenOnInit(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  login(token: string): void {
    localStorage.setItem('accessToken', token);
    this.authStatus.next(true);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }
}
