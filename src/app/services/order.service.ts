import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Order } from "../models/order.model";
import { Observable } from "rxjs";

@Injectable()
export class OrderService {
    private apiUrl = environment.apiUrl + "orders";

    constructor(private http: HttpClient) {

    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    getOrders(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getOrderSaleCountByDate(date:any): Observable<any> {  
        let dateCount = {
            'created_on' : date
        }
        // console.log(dateCount)
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + '/orderDate', dateCount,{headers});
    }

    getOrdersForUser(userId: number): Observable<Order[]> {
        const url = `${this.apiUrl}?userId=${userId}`;
        return this.http.get<Order[]>(url);
      }

    getOrderById(id: number): Observable<Order> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Order>(url);
    }

    updateOrder(id: number | undefined, order: Order): Observable<Order> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Order>(url, order);
    }

    deleteOrder(id: number | undefined): Observable<Order> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<Order>(url);
    }


    
  
}