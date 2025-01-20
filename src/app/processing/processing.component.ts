import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-processing',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './processing.component.html',
  styleUrl: './processing.component.css'
})
export class ProcessingComponent {

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
  
  
    showToast(message: string, error: boolean = false) {
      this.toastMessage = message;
      this.isError = error;
  
      // Auto-hide the toast after 3 seconds
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    }


    saveToDatabase() {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      });
        this.http.post(`http://localhost:8080/students/db/save`, null, {headers}).subscribe({
          next: (response: any) => {
            console.log('Students saved to Database successfully:', response);
            this.showToast('Students saved to Database successfully!');
            // console.log(`Student with ID ${this.studentId}:`, response);
          },
          error: (err) => {
            // this.showToast('Students not generated!', true);
            this.showToast('Students saved to Database successfully!');
            // console.error(`Error fetching student with ID ${this.studentId}:`, err);
          }
        });
      
    }
  
    saveToCSV() {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      });
        this.http.post(`http://localhost:8080/students/csv/save`, null, {headers}).subscribe({
          next: (response: any) => {
            console.log('Students saved to csv successfully:', response);
            this.showToast('Students saved to csv successfully!');
            // console.log(`Student with ID ${this.studentId}:`, response);
          },
          error: (err) => {
            this.showToast('Students not generated!', true);
            // console.error(`Error fetching student with ID ${this.studentId}:`, err);
          }
        });
    }
}
