import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SelectedStudent, Student } from '../interfaces/student'; // Import the model
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { SelectedStudentsService } from '../selected-students.service';
import { SelectedListComponent } from "../selected-list/selected-list.component";
import { AverageComponent } from "../average/average.component";

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatDialogModule,
    MatButtonModule, FormsModule, SelectedListComponent, AverageComponent],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  userString = localStorage.getItem('user');
  user = this.userString ? JSON.parse(this.userString) : null;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.user.token}`
  });

  // selectedStudents = [
  //   { studentId: 1, name: 'John Doe', score: 90 },
  //   { studentId: 2, name: 'Jane Smith', score: 85 },
  //   { studentId: 3, name: 'Sam Wilson', score: 88 },
  // ];


  paginatedStudents: Student[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  searchStudentId: string = '';
  selectedClass: string = '';
  startDate: string = '';
  endDate: string = '';
  fileName: string = '';
  selectedStatus: number = 0;
  
  classes: string[] = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']; 

  constructor(private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private selectedStudentService: SelectedStudentsService
  ) {}

  ngOnInit() {
    this.loadStudents(); // Fetch students on component initialization
  }

  // addStudent() {
  //   console.log
  //   const newStudent = { studentId: 4, name: 'New Student', score: 95 };
  //   this.selectedStudentService.updateSelectedStudents([newStudent]); // Update students list
  // }

  selectStudent(studentId: number, studentName: string, score: number) {
    const student: SelectedStudent = {
      studentId,
      name: studentName,
      score
    };
    console.log(student)
    this.selectedStudentService.updateSelectedStudents(student);
    // this.selectedStudentService.addStudent(student);

    // this.selectedStudents.push({
    //   studentId: 1,
    //   name: "William",
    //   score: 10
    // })

    // console.log(this.selectedStudents)
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
      'Authorization': `Bearer ${user.token}`
    });
    this.http.get<Student[]>('http://localhost:8080/students/sql', { headers })
      .subscribe({
        next: (response: Student[]) => {
          console.log('Students fetched successfully', response);
          this.students = response;
          this.totalPages = Math.ceil(this.students.length / this.pageSize);
          this.updatePagination();
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

    const userString = localStorage.getItem('user');
    console.log('User string:', userString);
    const user = userString ? JSON.parse(userString) : null;
    console.log('User:', user);
    console.log('User:', user.token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:8080/students/${studentId}`, {headers}).subscribe({
          next: () => {
            this.students = this.students.filter(student => student.studentId !== studentId);
            this.paginatedStudents = this.students;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error deleting student:', err);
          }
        });
      }
    });
  }

  trackByStudentId(index: number, student: any): number {
    return student.studentId;
  }
  
  deleteAllStudents() {
    this.http.delete('http://localhost:8080/api/students').subscribe(() => {
      this.loadStudents();
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
    this.router.navigate([`/student/${studentId}`]);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.students.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  applyFilters(): void {
    let filteredStudents = [...this.students];

    // Apply Student ID Filter
    if (this.searchStudentId) {
      filteredStudents = filteredStudents.filter(student =>
        student.studentId.toString().includes(this.searchStudentId)
      );
    }

    // Apply Class Filter
    if (this.selectedClass) {
      filteredStudents = filteredStudents.filter(student =>
        student.studentClass === this.selectedClass
      );
    }

    // Apply Date of Birth Filter
    if (this.startDate && this.endDate) {
      filteredStudents = filteredStudents.filter(student =>
        new Date(student.dob) >= new Date(this.startDate) && new Date(student.dob) <= new Date(this.endDate)
      );
    }

    if (this.selectedStatus) {
      console.log('Selected Status:', this.selectedStatus);
      filteredStudents = filteredStudents.filter(student => student.editingStatus === parseInt(this.selectedStatus.toString()));
      if (parseInt(this.selectedStatus.toString()) === 0) {
        filteredStudents = this.students;
      }
    }

    // Paginate the filtered results
    this.totalPages = Math.ceil(filteredStudents.length / 10);
    this.paginatedStudents = filteredStudents.slice((this.currentPage - 1) * 10, this.currentPage * 10);
  }

  exportToExcel(): void {
    const filteredData = this.paginatedStudents.map(student => ({
      'StudentId': student.studentId,
      'First Name': student.firstName,
      'Last Name': student.lastName,
      'Class': student.studentClass,
      'Score': student.score,
      'Photo Path': student.photoPath,
      // 'Status': student.status,
      'Date of Birth': student.dob,
    }));
    const fileName = this.fileName ? `${this.fileName}.xlsx` : 'students.xlsx';
    // Create a worksheet from the filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Export to file
    XLSX.writeFile(wb, fileName);
  }


}
