import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PhotoPath, Student } from '../interfaces/student'; // Ensure you have the Student interface
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

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
    editingStatus: 0,
    makerUserId: '',
    checkerUserId: '',
    checkerComments: '',
    isApproved: false,
    draftFirstName: '',
    draftLastName: '',
    draftStudentClass: '',
    draftScore: 0,
    draftPhotoPath: '',
    draftDOB: ''
  };
  selectedFile: File | null = null;
  studentForm: any;
  private apiUrl = 'http://localhost:8080/students';

  draftStudent = { ...this.student };
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

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }
  
  getStudentById(studentId: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    
    const tokenInfo = this.getDecodedAccessToken(user.token);

    this.http.get<Student>(`http://localhost:8080/students/sql/${studentId}`, { headers })
      .subscribe({
        next: (response) => {
          this.student = response;
          this.draftStudent = { ...this.student };
          this.draftStudent.draftDOB = this.formatDate(this.student.dob);
          this.draftStudent.draftFirstName = this.student.firstName;
          this.draftStudent.draftLastName = this.student.lastName;
          this.draftStudent.draftStudentClass = this.student.studentClass;
          this.draftStudent.draftScore = this.student.score;
          this.draftStudent.draftPhotoPath = this.student.photoPath;
          console.log('Student fetched successfully', this.student);
          this.student.dob = this.formatDate(this.student.dob);
          this.draftStudent.makerUserId = tokenInfo?.id;
        },
        error: (error) => {
          console.error('Error fetching student:', error);
        }
      });

      console.log(user);
      console.log(tokenInfo);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    });
    console.log('Student:', this.student);
    // this.student.dob = new Date(this.student.dob).toISOString();
    this.draftStudent.draftDOB = new Date(this.student.dob).toISOString();

    console.log('Draft student:', this.draftStudent);
    this.saveDraft(this.draftStudent, user?.id).subscribe({
      next: (response) => {
        console.log('Student updated successfully', response);
        // this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Error updating student:', error);
      }
    });
  }

  approveUser() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    });
    console.log('Student:', this.student);
    // this.student.dob = new Date(this.student.dob).toISOString();
    this.draftStudent.draftDOB = new Date(this.student.dob).toISOString();

    console.log('Draft student:', this.draftStudent);
    this.approveChanges(this.student.studentId, user?.id).subscribe({
      next: (response) => {
        console.log('Student updated successfully', response);
        // this.router.navigate(['/students']);
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
          // this.student.photoPath = response?.photoUrl;
          this.draftStudent.photoPath = response?.photoUrl;
          // this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    }
  }

  
  saveDraft(student: Student, makerUserId: number): Observable<Student> {
    console.log('Draft student22:', student);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/draft`, student, { headers });
  }

  approveChanges(studentId: number, checkerUserId: number): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/approve?studentId=${studentId}&checkerUserId=${checkerUserId}`, null, { headers });
  }

  rejectChanges(studentId: number, checkerUserId: number, comments: string): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/reject?studentId=${studentId}&checkerUserId=${checkerUserId}&comments=${comments}`, { headers });
  }

  resetDraft(studentId: number, makerUserId: number): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/reset?studentId=${studentId}&makerUserId=${makerUserId}`, null, { headers });
  }

  

}
