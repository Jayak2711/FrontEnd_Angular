import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFailed: boolean = false;
  userExist: string = '';;

  ngOnInit(): void {
    this.title.setTitle("Login");
  }

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private title: Title) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  validateControl = (controlName: string) => {
    if (this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched) {
      return true;
    }

    return false;
  }

  login(): void {
    var loginData = {
      'email' : this.loginForm.value.email,
      'password' : this.loginForm.value.password
    }
    if (this.loginForm.valid) {
      this.authService.login(loginData).subscribe({
        next: (res) => {
          this.loginFailed = false;
          if(res.status == 'failed'){
            if(res.result == 'incorrectPass'){
             this.userExist = 'Email id or password incorrect!' ;
            }else{
              this.userExist = 'Email id does not exist. Please register your mailid';
            }
          }else if(res.status == 'success'){
            this.userExist = '';
            console.log(res.result)
            sessionStorage.setItem('currentUser',JSON.stringify(res.result));
            this.router.navigate(['/']);
          }
        },
        // error: (error) => {
        //   this.loginFailed = true;
        // }
      })
    }
  }
}
