import { Component } from '@angular/core';
import { SelectedStudentsService } from '../selected-students.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-average',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './average.component.html',
  styleUrl: './average.component.css'
})
export class AverageComponent {
    average: number | null | undefined;
    total: number | null | undefined;
    
    constructor(
      private selectedStudentService: SelectedStudentsService
    ) {}
  
  
    ngOnInit() {
      this.selectedStudentService.average$.subscribe((average) => {
        this.average = average;
      });
  
      this.selectedStudentService.total$.subscribe((total) => {
        this.total = total;
      });
      
      console.log('Selected Students average:', this.average);
      console.log('Selected Students total:', this.total);
    }
}
