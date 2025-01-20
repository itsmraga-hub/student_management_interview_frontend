import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Student } from '../interfaces/student'; // Import the model
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatDialogModule,
    MatButtonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = []; // Array to store students
  userString = localStorage.getItem('user');
  user = this.userString ? JSON.parse(this.userString) : null;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.user.token}` // Pass the token in the Authorization header
  });

  constructor(private http: HttpClient,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.loadStudents(); // Fetch students on component initialization
  }



  loadStudents() {
    if (typeof window !== 'undefined' && window.localStorage) {
    const userString = localStorage.getItem('user');
    console.log('User string:', userString);
    const user = userString ? JSON.parse(userString) : null;
    console.log('User:', user);
    console.log('User:', user.token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}` // Pass the token in the Authorization header
    });
    this.http.get<Student[]>('http://localhost:8080/students/sql', { headers }) // Your API endpoint here
      .subscribe({
        next: (response: Student[]) => {
          console.log('Students fetched successfully', response);
          this.students = response;
        },
        error: (err) => {
          console.error('Error fetching students', err);
        }
      });
  }
}

  deleteStudent(studentId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    // Call the API to delete the student
    // this.http.delete(`http://localhost:8080/api/students/${studentId}`).subscribe(() => {
    //   this.loadStudents(); // Reload the students after deletion
    // });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:8080/students/${studentId}`).subscribe({
          next: () => {
            console.log(`Student with ID ${studentId} deleted`);
            this.students = this.students.filter(student => student.studentId !== studentId);
          },
          error: (err) => {
            console.error('Error deleting student:', err);
          }
        });
      }
    });
  }

  deleteAllStudents() {
    // Call the API to delete all students
    this.http.delete('http://localhost:8080/api/students').subscribe(() => {
      this.loadStudents(); // Reload the students after deletion
    });
  }

  onEditStudent(studentId: number) {
    this.router.navigate([`/students/edit/${studentId}`]);
  }
  

  updateStudent(studentId: number) {
    // Logic for updating student
    console.log(`Updating student with ID: ${studentId}`);
  }

  viewStudent(studentId: number) {
    // Logic for viewing student details
    console.log(`Viewing student with ID: ${studentId}`);
  }
}
