import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../interfaces/student';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-generation',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './generation.component.html',
  styleUrl: './generation.component.css'
})
export class GenerationComponent {

  count: number | null = null;
  toastMessage: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  userString = localStorage.getItem('user');
  user = this.userString ? JSON.parse(this.userString) : null;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.user.token}` // Pass the token in the Authorization header
  });

  constructor(private http: HttpClient) { }

  generateStudents() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    });
    if (this.count !== null && this.count >= 0) {
      this.isLoading = true;
      const requestUrl = `http://localhost:8080/students/generate?count=${this.count}`;
      const body = null;
  
      firstValueFrom(this.http.post<any>(requestUrl, body, { headers }))
        .then((response) => {
          console.log('Students generated successfully:', response);
          // this.showToast('Document with ' + this.count + ' students generated successfully!');
          this.showToast(response.message);
          this.isLoading = false;
        })
        .catch((err) => {
          console.error('Error status:', err.status);
          console.error('Error message:', err.statusText);
          this.showToast('Students not generated!' + err.statusText, true);
          this.isLoading = false;
        });
    } else {
      console.error('Please enter a valid count.');
    }
  }

  showToast(message: string, error: boolean = false) {
    this.toastMessage = message;
    this.isError = error;

    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

}
