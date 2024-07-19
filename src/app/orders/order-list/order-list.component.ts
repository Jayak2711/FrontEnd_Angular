import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];
  users: User[] = [];

  constructor(private orderService: OrderService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchUsers();
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  fetchUsers() {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }


  markAsShipped(order: Order) {
    if (order.status === 'Pending') {
      order.status = "Shipped";
    }

    this.orderService.updateOrder(order.id, order).subscribe(() => {
      this.orders = this.orders.map(o => o.id === order.id ? { ...order, status: 'Shipped' } : o);
    });
  }

  deleteOrder(id: number | undefined) {
    if (confirm("Are you sure you want to delete this order?")) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.fetchOrders(); //refresh the list of orders after deletion..
      });
    }
  }
}
