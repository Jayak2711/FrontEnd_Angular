import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: Order[] = [];
  orderAdmin :any ;
  currentUser: User | null = null;

  constructor(private orderService: OrderService, private authService: AuthService,private cartservice:CartService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadOrdersForUser(this.currentUser.id);
    } else {
      console.error('User not authenticated.');
    
    }
    this.getOrderForAdmin()
  }

  getOrderForAdmin(){
    this.orderService.getOrders().subscribe(res =>{
      this.orderAdmin = res
    })
  }

  loadOrdersForUser(userId: number) {
    this.orderService.getOrdersForUser(userId).subscribe((orders) => {
      this.orders = orders;
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }

  removeOrder(orderId?: number) { 
    if (!orderId) {
      console.error('Invalid orderId:', orderId);
      return;
    }

    if (confirm('Are you sure you want to remove this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        console.log('Order removed successfully.');
      }, error => {
        console.error('Error removing order:', error);
      });
    }
  }
}