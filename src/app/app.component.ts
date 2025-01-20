import { Component } from '@angular/core';
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
//   template: `
//   <main>
//     <header class="brand-name">
//       <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true" />
//     </header>
//     <section class="content">
//     <router-outlet></router-outlet>
//     <nav>
//   <a class="button" routerLink="/login" routerLinkActive="activebutton"
//   ariaCurrentWhenActive="page">Login</a> |
//   <a class="button" routerLink="/" routerLinkActive="activebutton" aria-current="page">Home</a> |
//   <a class="button" routerLink="/register" routerLinkActive="activebutton"
//   ariaCurrentWhenActive="page">Register</a>
// </nav>
//     </section>
//   </main>
// `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'student_management_frontend';
  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.validateToken();
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
