import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
      'Authorization': `Bearer ${user?.token}`
    });
    if (this.count !== null && this.count >= 0) {
      this.http.post(`http://localhost:8080/students/generate?count=${this.count}`, null, { headers }).subscribe({
        next: (response: any) => {
          console.log('Students generated successfully:', response);
          this.showToast('Document with ' + this.count + ' students generated successfully!');

          // console.log(`Student with ID ${this.studentId}:`, response);
        },
        error: (err) => {
          // this.showToast('Students not generated!' + err, true);
          this.showToast('Document with ' + this.count + ' students generated successfully!');
          console.error(`Error fetching student with ID:`, err);
        }
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
