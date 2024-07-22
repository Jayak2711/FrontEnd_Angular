import { Injectable } from "@angular/core";
import { OrderProduct } from "../models/orderProduct.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartKey = "cartItems";
    private cart: OrderProduct[] = []; //productId and quantity
    private apiUrl = environment.apiUrl + "product";
    constructor(private http : HttpClient) {
        this.loadCart();
    }

    addToCart(data : any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + '/cart', data,{headers});
        // const existingItem = this.cart.find(item => item.productId === productId);

        // if (existingItem) {
        //     existingItem.quantity += quantity;
        // } else {
        //     this.cart.push({ productId, quantity });
        // }

        // this.saveCart();
    }


    private loadCart() {
        const storedCart = localStorage.getItem(this.cartKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
        }
    }

    getCart() {
        return this.cart;
    }

    private saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    }

    removeFromCart(productId: number) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        localStorage.clear();
    }

    getCartById(id: number): Observable<any> {
        const url = `${this.apiUrl  + '/cart'}/${id}`;
        return this.http.get<any>(url);
    }

    deleteCartById(id: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.delete<any>(this.apiUrl + '/cart', { headers, body: id});    
    }

 
}