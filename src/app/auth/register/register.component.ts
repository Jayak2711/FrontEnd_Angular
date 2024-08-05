import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { dateBeforeTodayValidator }  from './dob-validotors'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string = "";
  showPassword: boolean = false;
  StrongPasswordRegx : RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;

  ngOnInit(): void {
    this.title.setTitle("Register");
  }

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private title: Title,private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', [Validators.required, dateBeforeTodayValidator()]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.pattern(this.StrongPasswordRegx)]],
      phoneNumber:['', Validators.required],
      confirmpassword: ['', Validators.required],
      isAdmin: [false]
    }, { validators: this.matchPasswords });
  }

  private matchPasswords(group: AbstractControl) {
    const password = group.get("password")?.value;
    const confirmpassword = group.get("confirmpassword")?.value;

    return password === confirmpassword ? null : { passwordMisMatch: true };
  }


  get passwordFormField() {
    return this.registerForm.get('password');
  }

  validateControl = (controlName: string) => {
    if (this.registerForm.get(controlName)?.invalid && this.registerForm.get(controlName)?.touched) {
      return true;
    }

    return false;
  }

  register(): void {
    if (this.registerForm.valid) {

      //Destructing the object to omit the field that we don't want.
      //The (...) operator helps collect the other properties into a new object called formData which excludes confirmPassword 
      const { confirmpassword, ...formData } = this.registerForm.value;
      this.authService.register(formData).subscribe({        
        next: (user) => {
          this.toastr.success('Success', 'User Registered Successfully', {
            timeOut: 4000,
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.toastr.error('Failed', error, {
            timeOut: 4000,
          });
        }
      })
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
