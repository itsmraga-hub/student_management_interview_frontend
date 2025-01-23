import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectedStudent } from './interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class SelectedStudentsService {

  private stateSource = new BehaviorSubject<SelectedStudent[]>([]);

  currentState = this.stateSource.asObservable();

  private selectedStudentsSource = new BehaviorSubject<any[]>([]);
  selectedStudents$ = this.selectedStudentsSource.asObservable();
  private averageSource = new BehaviorSubject<number>(0);
  average$ = this.averageSource.asObservable();

  private totalSource = new BehaviorSubject<number>(0);
  total$ = this.totalSource.asObservable();

  updateSelectedStudents(student: SelectedStudent) {
    const currentStudents = this.selectedStudentsSource.getValue();
    const studentExists = currentStudents.some(s => s.studentId === student.studentId);

    if (!studentExists) {
      this.selectedStudentsSource.next([...currentStudents, student]);
      const totalGrades = [...currentStudents, student].reduce((sum, student) => sum + student.score, 0);
      const averageGrade = totalGrades / ([...currentStudents, student].length);
      this.totalSource.next(totalGrades);
      this.averageSource.next(averageGrade);
    }
  }
  
  constructor() { }
}

