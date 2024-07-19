import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService){

  }

  get isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  get getCurrentUser(){
    return this.authService.getCurrentUser();
  }

  get isAdmin(){
    return this.authService.isAdmin();
  }
}
