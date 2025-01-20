import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { authGuard } from './auth.guard';
import { StudentsComponent } from './students/students.component';
import { StudentComponent } from './student/student.component';
import { GenerationComponent } from './generation/generation.component';
import { ProcessingComponent } from './processing/processing.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'generate', component: GenerationComponent, canActivate: [authGuard] },
  { path: 'processing', component: ProcessingComponent, canActivate: [authGuard] },
  { path: 'report', component: ReportComponent, canActivate: [authGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [authGuard] },
  { path: 'student/:id', component: StudentComponent, canActivate: [authGuard] },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'students/edit/:id', component: EditStudentComponent, canActivate: [authGuard] },
  // { path: '', component: HomeComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent},
  
];
