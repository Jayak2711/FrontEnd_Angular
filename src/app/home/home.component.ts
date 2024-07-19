import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLoginMessage: boolean = false;
  constructor(private cartService: CartService, private productService: ProductService, private orderService: OrderService, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {


    if (!this.authService.isAuthenticated()) {
      this.showLoginMessage = true;
    }
  }

 show() {
    if (!this.authService.isAuthenticated()) {
      this.showLoginMessage = true;
      alert("Please login to place an order");
      this.router.navigate(['/auth/login']);
      return;
    }
  }
}
