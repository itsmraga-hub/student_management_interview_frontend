import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectedStudentsService } from '../selected-students.service';
import { SelectedStudent } from '../interfaces/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-list.component.html',
  styleUrl: './selected-list.component.css'
})
export class SelectedListComponent implements OnInit {
  selectedStudents: SelectedStudent[] | undefined;
  average: number | null | undefined;
  total: number | null | undefined;
  
  constructor(private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private selectedStudentService: SelectedStudentsService
  ) {}


  ngOnInit() {
    this.selectedStudentService.selectedStudents$.subscribe((students) => {
      this.selectedStudents = students;
    });

    this.selectedStudentService.average$.subscribe((average) => {
      this.average = average;
    });

    this.selectedStudentService.total$.subscribe((total) => {
      this.total = total;
    });
    
    console.log('Selected Students:', this.selectedStudents);
    console.log('Selected Students average:', this.average);
    console.log('Selected Students total:', this.total);
  }
}



