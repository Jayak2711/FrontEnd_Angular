import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

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
  StrongPasswordRegx : RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) 
  
  {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // password : ['', [Validators.required,Validators.pattern(this.StrongPasswordRegx)]]
      password : ['']
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

  get passwordFormField() {
    return this.forgotForm.get('password');
  }

  onSubmit() {
    if (this.forgotForm.controls['email'].status == 'VALID') {
      let forPassword = {
        'email' : this.forgotForm.value.email,
        // 'password' : this.forgotForm.value.password
      }
      this.authService.forgetPassword(forPassword).subscribe({
        next: (res) => {
            if(res.status == 'success'){
              this.toastr.success('Success', 'Email Verified Successfully', {
                timeOut: 4000,
              });
              this.userDetails = res.result;
              this.emailVerified = true;
              const passwordControl = this.forgotForm.get('password');
              passwordControl?.setValidators([
                Validators.required,
                Validators.pattern(this.StrongPasswordRegx)
              ]);
              passwordControl?.updateValueAndValidity();
            }else{
              // alert(res.error + ' ' + 'Please try with correct email id');
              this.toastr.error('Failed', 'Please try with correct email id', {
                timeOut: 4000,
              });
            }
        },
        error: (err) => {
          this.error = err.message; // Handle error message
        }
      });
    }
  }

  // changePassword(){
  //   let forPassword = {
  //     'user_id' : this.userDetails.user_id,
  //     'password' : this.forgotForm.value.password
  //   }
  //   console.log(forPassword)
  //   this.authService.changePassword(forPassword).subscribe({
  //     next: (res) => {
  //         if(res.status == 'success'){
  //           this.toastr.success('Success', 'Password changed successfully', {
  //             timeOut: 4000,
  //           });
  //           this.router.navigate(['/auth/login']);
  //         }
  //     },
  //     error: (err) => {
  //       // this.error = err.message; // Handle error message
  //       this.toastr.error('Failed', 'Something Went wrong, Please try again', {
  //         timeOut: 4000,
  //       });
  //     }
  //   });
  // } 



  changePassword(){
    console.log(this.forgotForm.get('password')?.value)
    let data =  {
      "newPassword": this.forgotForm.get('password')?.value
    }
    if(this.forgotForm.valid){
    this.userService.updatePassword(this.userDetails.user_id,data).subscribe(
      (data:any) => {
        if(data){
          this.toastr.success('Success','Password changes successfully');
          this.router.navigate(['/auth/login']);
        }
       
      },
      (error:any) => {
        this.toastr.error('Failed',error.error);
      }
    );
  }
    }

}
