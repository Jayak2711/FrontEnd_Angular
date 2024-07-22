import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  @ViewChild('accountModal') accountModal!: ElementRef;
  @ViewChild('closebutton') closebutton : any;
  user: User | null = null;
  newName: string = '';
  // password: string='';
  // newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUser()?.user_id;
    if (userId) {
      this.userService.getUser(userId).subscribe(user => {
        this.user = user;
      });
    } 
    else {
      console.error('User not authenticated.');
    }
  }


  openModal() {
    if (this.user) {
      this.newName = this.user.user_name; 
      this.accountModal.nativeElement.style.display = 'block';
    }
  }

  closeModal() {
    this.accountModal.nativeElement.style.display = 'none';
  }
  
  saveProfile() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe(updatedUser => {
        this.user = updatedUser;
        console.log('Profile updated successfully.');
        this.closebutton.nativeElement.click();
      }, error => {
        console.error('Error updating profile:', error);
      });
    }
  }

  // changePassword() {
  //   const userId = this.authService.getCurrentUser()?.user_id;
  //   if (userId && this.newPassword === this.confirmPassword) {
  //     this.userService.changePassword(userId, this.newPassword).subscribe(() => {
  //       console.log('Password changed successfully.');
  //       this.newPassword = '';
  //       this.confirmPassword = '';
  //     }, error => {
  //       console.error('Error changing password:', error);
  //     });
  //   } else {
  //     console.error('Passwords do not match.');
  //   }
  // }
}
