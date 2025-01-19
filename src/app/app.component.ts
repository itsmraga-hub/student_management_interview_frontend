import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
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
}
