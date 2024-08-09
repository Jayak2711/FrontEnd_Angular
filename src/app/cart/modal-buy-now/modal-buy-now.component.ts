import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-modal-buy-now',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './modal-buy-now.component.html',
  styleUrl: './modal-buy-now.component.css'
})
export class ModalBuyNowComponent {

  paymentMode : any = [
  {
    'id' : 1,'mode' : 'Cash On Delivey'
  },
  {
    'id' : 2,'mode' : 'Debit Card'
  },
  {
    'id' : 3,'mode' : 'Credit Card'
  },
  {
    'id' : 4,'mode' : 'UPI'
  },

]
  orderDetails: any;
paymentTypeValue: any = 'Cash On Delivey';
country: any;
add1: any;
add2: any;
landmark: any;
state: any;
district: any;
pincode:any
  cartList: any;
  userDetails: any = {
    'address1' : '',
    'address2' : '',
    'pincode'   : '',
    'district' : '',
    'country' : '',
    'state' : '',
    'landmark' : ''
  };
  totalAmount: any;
loading: boolean = false;

constructor(private route: ActivatedRoute,private router : Router, 
  private orderService: OrderService,private toastr: ToastrService,
  private cartService: CartService,private authService: AuthService){}

  ngOnInit(): void {
    this.orderDetails = history.state.data;
    this.cartList = history.state.cart;
    this.totalAmount = history.state.amount;
      this.userInfo();
  }


  userInfo(){
    this.loading = true;
    setTimeout(() => {
      this.authService.userPersonalDetails(this.orderDetails[0].user_id).subscribe(res => {
        if(res.status == 200){
          this.userDetails = res.result;
        }
        },
        error => {
          console.error('Error fetching user details', error);
        }
      )
      this.loading = false;
    }, 2000); // 2 seconds
  

  }



makePayment(){
var currentdate =  new Date();
    let orderArr = [];
    for(let i=0;i<this.orderDetails.length;i++){
      orderArr.push(this.orderDetails[i].id)
    }
    let payment =   {
          "created_on" : currentdate,
          "order_id": orderArr,
          "payment_method": this.paymentTypeValue,
          "trackrec": 'ordered',
          "status": 'Success',
      }
      this.loading = true;
      setTimeout(() => {
        this.orderService.makePayment(payment).subscribe(res =>{
          if(res.status == "200"){
             this.cartService.deleteCartById(this.cartList).subscribe(res=>{
              this.toastr.success('Success','Payment Successfully done');
            this.router.navigate(['/'])
          })
          }
        })
    
        this.loading = false;
      }, 2000);
  
  }

  paymentType(type : any){
   this.paymentTypeValue = type;
  }

}
