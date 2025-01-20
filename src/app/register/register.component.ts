import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  fullName: string = '';
  password: string = '';
  confirmPassword: string = '';  // Add the confirm password field

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  onRegister() {
    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return; // Exit the function if passwords do not match
    }

    const registerData = {
      email: this.email,
      password: this.password,
      fullName: this.fullName
    };
    console.log('Registering user', registerData);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post('http://localhost:8080/auth/signup', registerData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          const storedResponse = response;
          this.showToast('Registration successful', false);
          localStorage.setItem('user', JSON.stringify(storedResponse));
          localStorage.setItem('accessToken', JSON.stringify(storedResponse.token));

          // Navigate to login or dashboard after successful registration
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Registration failed', error);
          this.showToast('Registration failed', true);
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
}
