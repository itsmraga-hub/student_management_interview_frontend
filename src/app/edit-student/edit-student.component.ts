import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PhotoPath, Student } from '../interfaces/student'; // Ensure you have the Student interface
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
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
    makerUserId: 0,
    checkerUserId: 0,
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
  comments: string = '';
  userId: number = 0;
  headers: any;

  toastMessage: string = '';
  isError: boolean = false;

  private apiUrl = 'http://localhost:8080/students';

  draftStudent = { ...this.student };
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      });

      const tokenInfo = this.getDecodedAccessToken(user.token);
      this.userId = tokenInfo?.id;
      console.log('Token info:', tokenInfo);
      console.log('User:', this.userId);
      const studentId = this.route.snapshot.paramMap.get('id');
      if (studentId) {
        this.getStudentById(studentId);
      }
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
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
            console.log('Student fetched successfully', this.student);
            this.draftStudent = { ...this.student };

            if (this.student.editingStatus === null || this.student.editingStatus === 0) {
              this.draftStudent.draftDOB = this.formatDate(this.student.dob);
              this.draftStudent.draftFirstName = this.student.firstName;
              this.draftStudent.draftLastName = this.student.lastName;
              this.draftStudent.draftStudentClass = this.student.studentClass;
              this.draftStudent.draftScore = this.student.score;
              this.draftStudent.draftPhotoPath = this.student.photoPath;
              this.student.draftDOB = this.formatDate(this.student.dob);
              this.draftStudent.makerUserId = tokenInfo?.id;
            } else if (this.student.editingStatus === 1) {
              this.draftStudent.draftDOB = this.formatDate(this.student.draftDOB);
              this.draftStudent.draftFirstName = this.student.draftFirstName;
              this.draftStudent.draftLastName = this.student.draftLastName;
              this.draftStudent.draftStudentClass = this.student.draftStudentClass;
              this.draftStudent.draftScore = this.student.draftScore;
              this.draftStudent.draftPhotoPath = this.student.draftPhotoPath;
              this.student.draftDOB = this.formatDate(this.student.draftDOB);
              this.draftStudent.checkerUserId = tokenInfo?.id;
            } else if (this.student.editingStatus === 2) {
              this.draftStudent.draftDOB = this.formatDate(this.student.draftDOB);
              this.draftStudent.draftFirstName = this.student.firstName;
              this.draftStudent.draftLastName = this.student.lastName;
              this.draftStudent.draftStudentClass = this.student.studentClass;
              this.draftStudent.draftScore = this.student.score;
              this.draftStudent.draftPhotoPath = this.student.photoPath;
              this.student.draftDOB = this.formatDate(this.student.draftDOB);
              this.draftStudent.checkerUserId = tokenInfo?.id;
              this.comments = this.student.checkerComments;
            }
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
    this.draftStudent.draftDOB = new Date(this.student.dob).toISOString();
    if (this.student.editingStatus === null || this.student.editingStatus === 0) {
      this.saveDraft(this.draftStudent).subscribe({
        next: (response) => {
          this.showToast('Student updated successfully');
          // this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    } else {
      this.showToast('Student is already being edited', true);
    }
  }

  approveUser() {
    console.log('Student:', this.student);
    if (this.student.editingStatus === 1) {
      if (this.userId === this.student.makerUserId) {
        this.showToast('Editor and Approver cannot be the same', true);
        return;
      }
      this.approveChanges(this.student.studentId, this.userId).subscribe({
        next: (response) => {
          console.log('Student updated successfully', response);
          this.showToast('Student changes approved successfully');
          // this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    } else {
      this.showToast('Student is not being edited', true);
    }
  }

  rejectUser() {
    if (this.comments.length <= 1) {
      this.showToast('Please provide comments', true);
      return;
    }

    if (this.userId === this.student.makerUserId) {
      this.showToast('Editor and Approver cannot be the same', true);
      return;
    }
    if (this.student.editingStatus === 1) {
      this.rejectChanges(this.student.studentId, this.userId).subscribe({
        next: (response) => {
          console.log('Student updated successfully', response);
          this.showToast('Student changes rejected successfully');
          // this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
          this.showToast('Error rejecting student changes', true);
        }
      });
    } else {
      this.showToast('Student is not being edited', true);
    }
  }

  resetUser() {

    this.approveChanges(this.student.studentId, this.userId).subscribe({
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
          },
          error: (error) => {
            console.error('Error updating student:', error);
          }
        });
    }
  }


  saveDraft(student: Student): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/draft`, student, { headers });
  }

  approveChanges(studentId: number, checkerUserId: number): Observable<Student> {
    if (this.userId === this.student.makerUserId) {
      return new Observable<Student>((observer) => {
        observer.error('Maker and checker cannot be the same');
      });
    }
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/approve?studentId=${studentId}&checkerUserId=${checkerUserId}`, null, { headers });
  }

  rejectChanges(studentId: number, checkerUserId: number,): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/reject?studentId=${studentId}&checkerUserId=${checkerUserId}`, this.comments, { headers });
  }

  resetDraft(studentId: number, makerUserId: number): Observable<Student> {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user?.token}`
    });
    return this.http.put<Student>(`${this.apiUrl}/reset?studentId=${studentId}&makerUserId=${makerUserId}`, null, { headers });
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
