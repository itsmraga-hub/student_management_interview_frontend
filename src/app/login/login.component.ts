import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    this.http.post('http://localhost:8080/auth/login', loginData, {headers})
      .subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          const storedResponse = response;
          localStorage.setItem('user', JSON.stringify(storedResponse));
          // Use the storedResponse as needed
          console.log('Stored response:', storedResponse);
          // Navigate to another page on success, e.g., a dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Login failed', error);
          alert('Invalid email or password!');
        }
      });
  }
}
