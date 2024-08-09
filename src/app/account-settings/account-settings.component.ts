import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  @ViewChild('accountModal') accountModal!: ElementRef;
  @ViewChild('closebutton') closebutton : any;
  user: any;
  newName: string = '';
  // password: string='';
  // newPassword: string = '';
  confirmPassword: string = '';
  editProfile : boolean = false;
  newUser: any;

  constructor(private authService: AuthService, private userService: UserService,private toastr: ToastrService,private router : Router) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUser()?.user_id;
   this.getUser(userId)
  }

  getUser(userId :any){
    if (userId) {
      this.userService.getUser(userId).subscribe((user :any) => {
        this.user = user.result;
        if(this.user.addressid){
          this.newUser = this.user.addressid
        }
      });
    } 
    else {
      console.error('User not authenticated.');
    }
  }

  changePassword(){
      this.router.navigate(['/changePassword'], { state: { data: this.user} });
  }

  editUser(){
    this.editProfile = true
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
    this.editProfile = false;
    if (this.user) {
    let userDetails = {
      "date_of_birth" : this.user.date_of_birth,
      "email_id" : this.user.email_id,
      "last_name" : this.user.last_name,
      "phone_number" : this.user.phone_number,
      "user_id" : this.user.user_id,
      "user_name" : this.user.user_name,
      "first_name" : this.user.first_name,
    }
    let addressDetail =  {
      "user_id": this.user.user_id,
      "address1": this.user.address1,
      "address2":this.user.address2,
      "state": this.user.state,
      "district": this.user.district,
      "country": this.user.country,
      "pincode": this.user.pincode,
      "landmark": this.user.landmark,
  }

  if(this.newUser == null){
    this.userService.addNewAddress(addressDetail).subscribe({
      next: (res:any) => {
        if(res.status == 200){
          this.toastr.success('Success', 'Profile updated Successfully', {
            timeOut: 4000,
          });
          this.ngOnInit();
        }
      
      },
      error: (error) => {
        this.toastr.error('Failed', 'Something went wrong,Please try again', {
          timeOut: 4000,
        });
      },
    })
  }else{
    this.userService.updateUser(userDetails).subscribe({
      next: (res:any) => {
        if(res.status == 200){
          this.userService.updateAdrress(addressDetail).subscribe({
            next: (res) => {
              console.log('Addresss',res)
              this.toastr.success('Success', 'Profile updated Successfully', {
                timeOut: 4000,
              });
            },error: (error) => {

            }
          })
        }
      
      },
      error: (error) => {
        this.toastr.error('Failed', 'Something went wrong,Please try again', {
          timeOut: 4000,
        });
      },
    })
  }

    }

  }
}
