import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-modal-buy-now',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './modal-buy-now.component.html',
  styleUrl: './modal-buy-now.component.css'
})
export class ModalBuyNowComponent {

  paymentMode : any = [
  {
    'id' : 1,'mode' : 'COA'
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
paymentTypeValue: any = 'COA';
country: any;
add1: any;
add2: any;
landmark: any;
state: any;
district: any;
pincode:any
  cartList: any;

constructor(private route: ActivatedRoute,private router : Router, private orderService: OrderService,private toastr: ToastrService,private cartService: CartService,){

}

  ngOnInit(): void {
    console.log(history.state)
    this.orderDetails = history.state.data;
    this.cartList = history.state.cart

  }





  makePayment(){
    let payment =   {
          "created_on" : '11/11/9221',
          "order_id": this.orderDetails.id,
          "payment_method": this.paymentTypeValue,
          "status": 1,
          "b_add1": this.add1,
          "b_add2": this.add2,
          "b_landmark": this.landmark,
          "pincode": this.pincode,
          "b_district": this.district,
          "amount" : 20000
      }
      

      this.orderService.makePayment(payment).subscribe(res =>{
        console.log(res)
        if(res.status == "200"){
          alert('payment success');
           this.cartService.deleteCartById(this.cartList).subscribe(res=>{
          this.router.navigate(['/'])
        })
        }
      })
  
  }

  paymentType(type : any){
    console.log(type)
   this.paymentTypeValue = type;
  }

}
