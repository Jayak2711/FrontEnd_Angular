import { Component, OnInit } from '@angular/core';
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

  cartItems: any[] = [];
  totalPrice: number = 0;
  showLoginMessage: boolean = false;
  userDetails: any;
  dialog: any;
  buyNowArr :any;
  buyNow: any;

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
  get calculateTotalPrice(): number {
    return this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  deleteCart(carId :number){
    let text = "Are you sure you want to remove from cart ?";
  if (confirm(text) == true) {
    this.cartService.deleteCartById(carId).subscribe(res => {})
  } 
  }

  loadCartDetails() {
    
    this.cartService.getCartById(this.userDetails?.user_id).subscribe(res => {
      this.cartItems = res.result;
    })
  }


  placeOrder(item : any) {
    console.log(item)
    this.buyNowArr.push(item)
    console.log( this.buyNowArr)
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

  
}
