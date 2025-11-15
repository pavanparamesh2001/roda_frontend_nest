import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

  // ⭐ IMPORTANT: Standalone components require these imports
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  submitted = false;
  loginError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Login Function
  login() {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Login successful');
const userRoles = this.auth.getUserRoles();

if (userRoles.includes('admin')) {
  this.router.navigate(['/admin/dashboard']);
} 
else if (userRoles.includes('agent')) {
  this.router.navigate(['/agent/dashboard']);
} 
else {
  this.toastr.error('No valid role found');
  this.router.navigate(['/login']);
}


      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = true;
        this.errorMessage = err?.error?.message || 'Invalid login credentials';
        this.toastr.error(this.errorMessage, 'Login Failed');
      },
    });
  }
}

