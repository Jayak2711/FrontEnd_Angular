import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { OrderProduct } from 'src/app/models/orderProduct.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
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
  checkBoxArr: any = [];
  cartIdList: any[] = [];
  // private toastr: ToastrService
  constructor(private cartService: CartService, private productService: ProductService, 
    private orderService: OrderService, private authService: AuthService, private router: Router,private toastr: ToastrService) {

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
    return this.totalPrice = this.cartItems.filter(item => item.checked).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  deleteCart(item :any){
    let cartIdArr = [];
    cartIdArr.push(item.cart_id)
    this.cartIdList = cartIdArr
    let text = "Are you sure you want to remove from cart ?";
  if (confirm(text) == true) {
    this.cartService.deleteCartById(cartIdArr).subscribe(res=>{
      if(res.status == '200'){
        this.toastr.success('Success', 'Cart removed Succussfully', {
          timeOut: 4000,
        });
      }
      this.ngOnInit();
    })
  }
  }

loadCartDetails() {
    this.cartService.getCartById(this.userDetails?.user_id).subscribe(res => {
      this.cartItems = res.result;
      for(let i=0;i<this.cartItems.length;i++){
        this.cartItems[i]['totalAmount']  = (this.cartItems[i].quantity * parseInt(this.cartItems[i].price));
        this.cartItems[i]['checked']  = true;
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
      
    })
  }


  userInfo(){
    this.authService.userPersonalDetails(this.userDetails.user_id).subscribe(res => {
      if(res.result.length == 0){
        alert('Please complete your profile first');
        this.personalInfo = res;
      }
    })
  }

  checkOut(product:any){
    console.log('------------------',product)
    var orderList = [];
    var carId : any = [];
    for(let i=0;i<product.length;i++){
    var order = {
      'quantity' : product[i].quantity,
      'user_id' : product[i].user_id,
      'p_id' : product[i].p_id,
      'created_on' :  new Date(),
      'status' : 'Placed'
    }
    orderList.push(order);
    carId.push(product[i].cart_id)
  }
  this.cartIdList = carId;
    this.orderService.placeAllOrder(orderList).subscribe(res =>{
      if(res.status = '200'){
        this.toastr.success('Success', 'Order placed Successfully', {
          timeOut: 1000,
        });
        this.router.navigate(['/payment'], { state: { data: res.result , cart : this.cartIdList, amount : this.calculateTotalPrice} });
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



  handleSelected(item :any,data :any){
    // console.log(data)
    // if (!item.srcElement.checked) {
    //   console.log(this.calculateTotalPrice);
    //   this.removeItem(item);
    // }else{
    //   this.checkBoxArr.push(data);
    //   console.log(this.calculateTotalPrice);
    // }
    for(let i=0;i<this.cartItems.length;i++){
      if (!item.srcElement.checked) {
        if(data.cart_id == this.cartItems[i].cart_id){
          this.cartItems[i].checked = false;
          // console.log(this.calculateTotalPrice);
        }
      }else{
        if(data.cart_id == this.cartItems[i].cart_id){
          this.cartItems[i].checked = true;
        }
      } 
    }


  }

  removeItem(item: any): void {
    this.checkBoxArr = this.checkBoxArr.filter((i:any) => i !== item);
  }

  placeOrderFinal(){
    let checkedRes = this.cartItems.filter(data => data.checked == true)
    if(checkedRes.length == 0){
      alert('Please Add atleast one item to order');
    }else{
      // this.buyNowArr = this.checkBoxArr;
      // console.log(this.buyNowArr)

      this.checkOut(this.cartItems.filter(data => data.checked == true));
    
    }   
  }

  increaseQuantity(quantity: any,i:number){
    // quantity.quantity++;
    // this.cartItems[i].quantity = quantity;
    this.cartItems[i].quantity ++;
    this.cartItems[i].totalAmount = parseInt(this.cartItems[i].price) * this.cartItems[i].quantity; // Update totalAmount
     
  }

  decreaseQuantity(quantity: any,i:number){
    if(quantity.quantity >= 1){
      // quantity.quantity--;
      this.cartItems[i].quantity --;
      this.cartItems[i].totalAmount = parseInt(this.cartItems[i].price) * this.cartItems[i].quantity; // Update totalAmount
      // this.cartItems[i].quantity = quantity;
    }
  }



  payment(eve :any){
   this.paymentMethod = eve;
  }
  
}
