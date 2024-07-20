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
  emailVerified : boolean = false;
  userDetails: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', []]
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
     console.log(this.forgotForm.controls['email'].status)
    if (this.forgotForm.controls['email'].status == 'VALID') {
      let forPassword = {
        'email' : this.forgotForm.value.email,
        // 'password' : this.forgotForm.value.password
      }
      this.authService.forgetPassword(forPassword).subscribe({
        next: (res) => {
            if(res.status == 'success'){
              alert(res.message)
              this.userDetails = res.result;
              this.emailVerified = true;
            }else{
              alert(res.error + ' ' + 'Please try with correct email id');
            }
        },
        error: (err) => {
          this.error = err.message; // Handle error message
        }
      });
    }
  }

  changePassword(){
    let forPassword = {
      'user_id' : this.userDetails.user_id,
      'password' : this.forgotForm.value.password
    }
    console.log(forPassword)
    this.authService.changePassword(forPassword).subscribe({
      next: (res) => {
          if(res.status == 'success'){
            alert(res.message);
            this.router.navigate(['/auth/login']);
          }
      },
      error: (err) => {
        this.error = err.message; // Handle error message
      }
    });
  } 

}
