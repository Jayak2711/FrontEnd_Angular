import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  forgotForm: FormGroup;
  requestSent: boolean = false;
  error: string = '';
  emailVerified : boolean = false;
  userDetails: any;
  StrongPasswordRegx : RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;
  constructor(private authService: AuthService,private fb: FormBuilder,private router: Router,private toastr: ToastrService, private userService: UserService
)
  
{
  this.forgotForm = this.fb.group({
    newPassword : ['', [Validators.required,Validators.pattern(this.StrongPasswordRegx)]]
  });
}

get passwordFormField() {
  return this.forgotForm.get('newPassword');
}

  ngOnInit(): void {
    this.userDetails = history.state.data;
    console.log(this.userDetails)
  }

  changePasswordReq(){
  if(this.forgotForm.valid){
  this.userService.updatePassword(this.userDetails.user_id,this.forgotForm.value).subscribe(
    (data:any) => {
      if(data){
        this.toastr.success('Success','Password changes successfully');
        this.router.navigate(['/settings']);
      }
     
    },
    (error:any) => {
      this.toastr.error('Failed',error.error);
    }
  );
}
  }

  validateControl = (controlName: string) => {
    if (this.forgotForm.get(controlName)?.invalid && this.forgotForm.get(controlName)?.touched) {
      return true;
    }

    return false;
  }
  get email() { return this.forgotForm.get('email'); }
}

// export const StrongPasswordRegx: RegExp =
//   /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
