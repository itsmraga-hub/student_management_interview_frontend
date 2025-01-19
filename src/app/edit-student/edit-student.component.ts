import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PhotoPath, Student } from '../interfaces/student'; // Ensure you have the Student interface
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  student: Student = {
    studentId: 0,
    firstName: '',
    lastName: '',
    studentClass: '',
    score: 0,
    status: 0,
    photoPath: '',
    dob: '',
  };
  selectedFile: File | null = null;
  studentForm: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.getStudentById(studentId);
    }
  }

  getStudentById(studentId: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });

    this.http.get<Student>(`http://localhost:8080/students/sql/${studentId}`, { headers })
      .subscribe({
        next: (response) => {
          this.student = response;
          console.log('Student fetched successfully', response);
          this.student.dob = this.formatDate(this.student.dob);
        },
        error: (error) => {
          console.error('Error fetching student:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Format date as YYYY-MM-DD for the input field
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    });
    this.student.dob = new Date(this.student.dob).toISOString();
    this.http.put<Student>(`http://localhost:8080/students/update/${this.student.studentId}`, this.student, { headers })
      .subscribe({
        next: (response) => {
          console.log('Student updated successfully', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
  }

  onFileSelected(event: Event) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
          const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
      this.http.post<PhotoPath>(`http://localhost:8080/students/upload/${this.student.studentId}`, formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Student updated successfully', response);
          this.student.photoPath = response?.photoUrl;
          // this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    }
  }


}
