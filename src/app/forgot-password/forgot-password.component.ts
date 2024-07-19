import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  forgotForm: FormGroup;
  requestSent: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required,Validators.min(6)]]
    });
  }

  ngOnInit(): void {
  }

  validateControl = (controlName: string) => {
    if (this.forgotForm.get(controlName)?.invalid && this.forgotForm.get(controlName)?.touched) {
      return true;
    }

    return false;
  }
  get email() { return this.forgotForm.get('email'); }

  onSubmit() {
   
    if (this.forgotForm.valid) {
      let forPassword = {
        'email' : this.forgotForm.value.email,
        'password' : this.forgotForm.value.password
      }
      this.authService.forgetPassword(forPassword).subscribe({
        next: () => {
          this.requestSent = true;
        },
        error: (err) => {
          this.error = err.message; // Handle error message
        }
      });
    }
  }

}
