import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderProduct } from 'src/app/models/orderProduct.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ModalBuyNowComponent } from '../modal-buy-now/modal-buy-now.component';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild('closebutton') closebutton : any;
  cartItems: any[] = [];
  totalPrice: number = 0;
  showLoginMessage: boolean = false;
  userDetails: any;
  dialog: any;
  buyNowArr :any = [];
  buyNow: any;
  personalInfo: any;
  paymentMethod : any = 'Mode of payment';
  paymentMode : any = ['COD','Debit Card','Credit Card']
  grandTotal: any;
  // private toastr: ToastrService
  constructor(private cartService: CartService, private productService: ProductService, 
    private orderService: OrderService, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    let userDetails : any = sessionStorage.getItem('currentUser');
    this.userDetails = JSON.parse(userDetails);
    this.loadCartDetails();

    if (!this.authService.isAuthenticated()) {
      this.showLoginMessage = true;
    }
  }


  //Reduce
  //reduce will iterate over cartItems and perform calculation for each item in the array and then give the total price
  get calculateTotalPrice(): any {
    return this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  deleteCart(item :any){
    let cartIdArr = [];
    cartIdArr.push(item.cart_id)
    let text = "Are you sure you want to remove from cart ?";
  if (confirm(text) == true) {
    this.cartService.deleteCartById(cartIdArr).subscribe(res=>{
      if(res.status == '200'){
        alert('Cart removed Succussfully')
      }
      // this.ngOnInit();
    })
  }
  }

loadCartDetails() {
    this.cartService.getCartById(this.userDetails?.user_id).subscribe(res => {
      this.cartItems = res.result;
      for(let i=0;i<this.cartItems.length;i++){
        this.cartItems[i]['totalAmount']  = (this.cartItems[i].quantity * parseInt(this.cartItems[i].price));
      }
      
    })
  }


  userInfo(){
    this.authService.userPersonalDetails(this.userDetails.user_id).subscribe(res => {
     this.personalInfo = res;
    })
  }

  checkOut(product:any){
    var orderList = [];
    var carId : any = [];
    for(let i=0;i<product.length;i++){
    var order = {
      'payment_mode' : this.paymentMethod,
      'quantity' : product[i].quantity,
      'user_id' : product[i].user_id,
      'p_id' : product[i].p_id,
      'created_on' : this.getCurrentFormattedDate()
    }
    orderList.push(order);
    carId.push(product[i].cart_id)
  }
    this.orderService.placeAllOrder(orderList).subscribe(res =>{
      if(res.status = '200'){
        alert('Order placed Successfully');
        this.cartService.deleteCartById(carId).subscribe(res=>{
          this.closebutton.nativeElement.click();
          this.ngOnInit();
        })
      }
    })
    
  }

   getCurrentFormattedDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }


  placeOrder(item : any,type:number) {
    this.userInfo();
    this.grandTotal = 0;
    this.buyNowArr = [];
    if(type == 1){
      this.grandTotal = item.totalAmount;
      this.buyNowArr.push(item);
    }else{
      this.buyNowArr = item;
    }

  
 
    // if (!this.authService.isAuthenticated()) {
    //   this.showLoginMessage = true;
    //   alert("Please login to place an order");
    //   return;
    // }

    //products: productId and quantity
    // const orderProducts: OrderProduct[] = this.cartItems.map(item => {
    //   return {
    //     productId: item.id,
    //     quantity: item.quantity
    //   }
    // });

    // const newOrder: Order = {
    //   userId: this.authService.getCurrentUser()?.id,
    //   products: orderProducts,
    //   totalPrice: this.totalPrice,
    //   date: new Date().toISOString().split('T')[0],
    //   status: 'Pending'
    // };

    // this.orderService.createOrder(newOrder).subscribe(() => {
    //   this.cartService.clearCart();
    //   this.router.navigate(['/cart/thank-you']);
    // })
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalBuyNowComponent, {
      data: {
        title: 'Dynamic Modal Title',
        message: 'This is a dynamically created modal!'
      }
    });

    dialogRef.afterClosed().subscribe((result :any) => {
      console.log('The dialog was closed');
    });
  }

  payment(eve :any){
   this.paymentMethod = eve;
  }
  
}
