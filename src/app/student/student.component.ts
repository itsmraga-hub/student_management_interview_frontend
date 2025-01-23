import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Student } from '../interfaces/student';

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
          'Authorization': `Bearer ${user.token}`
        });
        this.http.get(`http://localhost:8080/students/sql/${studentId}`, {headers}).subscribe({
          next: (response: any) => {
            this.student = response;
          },
          error: (err) => {
            console.error('Error fetching student details', err);
            this.router.navigate(['/dashboard']);
          }
        });

      }
    }
  }

  
}
