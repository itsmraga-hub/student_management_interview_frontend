import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'student_management_frontend';
  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.isAuthenticated = this.authService.validateToken();
  }


  ngOnInit(): void {
    this.authService.authStatus$.subscribe(
      (status) => {
        this.isAuthenticated = status;
      }
    );
  }


  logout(): void {
    this.authService.logout();
  }
}
