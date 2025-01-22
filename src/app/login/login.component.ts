import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';



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

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

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
          this.showToast('Login successful', false);
          localStorage.setItem('user', JSON.stringify(storedResponse));
          localStorage.setItem('accessToken', JSON.stringify(storedResponse.token));

          // Use the storedResponse as needed
          console.log('Stored response:', storedResponse);
          // Navigate to another page on success, e.g., a dashboard
          
          this.router.navigate(['/dashboard']);
          // this.refreshRoute();
        },
        error: (error: any) => {
          this.showToast('Login failed', true);
          console.error('Login failed', error);
        }
      });
  }
  

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
    });
  }


  // refreshRoute() {
  //   const currentUrl = this.router.url;
  //   this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
  //     this.router.navigateByUrl(currentUrl);
  //   });
  // }

}
