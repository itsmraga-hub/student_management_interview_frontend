import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  goBack() {
    this.router.navigate(['/students']);
    // throw new Error('Method not implemented.');
  }
  student: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');

    if (studentId) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Pass the token in the Authorization header
        });
        // Fetch the student details using the ID
        this.http.get(`http://localhost:8080/students/sql/${studentId}`, {headers}).subscribe({
          next: (response: any) => {
            this.student = response;  // Save the student data
          },
          error: (err) => {
            console.error('Error fetching student details', err);
            this.router.navigate(['/dashboard']);  // Redirect to dashboard on error
          }
        });

      }
    }
  }
}
