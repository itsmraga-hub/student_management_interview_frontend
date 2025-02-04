import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Student } from '../interfaces/student';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  studentId: number | null = null;
  count: number | null = null;
  totalStudents: number | null = null;
  toastMessage: string = ''; 
  isError: boolean = false;

    userString = localStorage.getItem('user');
    user = this.userString ? JSON.parse(this.userString) : null;
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.user.token}` // Pass the token in the Authorization header
    });

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  showToast(message: string, error: boolean = false) {
    this.toastMessage = message;
    this.isError = error;

    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  // Method to fetch all students
  ngOnInit() {
    this.loadStudents(); // Fetch students on component initialization
  }



  loadStudents() {
    if (typeof window !== 'undefined' && window.localStorage) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}` // Pass the token in the Authorization header
    });
    this.http.get<Student[]>('http://localhost:8080/students/sql', { headers }) // Your API endpoint here
      .subscribe({
        next: (response: Student[]) => {
          console.log('Students fetched successfully', response);
          this.totalStudents = response.length;
        },
        error: (err) => {
          console.error('Error fetching students', err);
        }
      });
  }
}

  // Method to delete all students
  deleteAllStudents() {
    this.http.delete('http://localhost:8080/students').subscribe({
      next: () => {
        console.log('All students deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting all students:', err);
      }
    });
  }

  // Method to create a new student
  createNewStudent() {
    const newStudent = {
      firstName: 'John',
      lastName: 'Doe',
      studentClass: '10-A',
      score: 90,
      status: 1,
      dob: '2005-05-15',
      photoPath: 'default.jpg'
    };

    this.http.post('http://localhost:8080/students', newStudent).subscribe({
      next: (response) => {
        console.log('New student created:', response);
      },
      error: (err) => {
        console.error('Error creating new student:', err);
      }
    });
  }

  // Method to fetch a student by ID
  generateStudents() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    });
    if (this.count !== null && this.count >= 0) {
      this.http.post(`http://localhost:8080/students/generate?count=${this.count}`, null, {headers}).subscribe({
        next: (response: any) => {
          console.log('Students generated successfully:', response);
          this.showToast('Document with ' + this.count + ' students generated successfully!');

          // console.log(`Student with ID ${this.studentId}:`, response);
        },
        error: (err) => {
          this.showToast('Students not generated!', true);
          // console.error(`Error fetching student with ID ${this.studentId}:`, err);
        }
      });
    } else {
      console.error('Please enter a valid count.');
    }
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
          this.showToast('Students not generated!', true);
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

  // showToast(message: string, isError: boolean = false) {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000, // Duration in milliseconds
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
  //   });
  // }
}
