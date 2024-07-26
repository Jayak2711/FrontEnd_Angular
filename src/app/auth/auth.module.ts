import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    NoAccessComponent,
    ForgotPasswordComponent 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AuthRoutingModule,
    FormsModule
  ],
  providers: [AuthService],
  exports: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    NoAccessComponent
  ]
})
export class AuthModule { }
