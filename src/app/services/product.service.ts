import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { Product } from "../models/product.model";

@Injectable()
export class ProductService {
    private apiUrl1 = environment.apiUrl1 + "Products"; // java
    private apiUrl = environment.apiUrl + "product"; // node


    //state management BS object
    //BS is an object that can store some data for us
    //initial value is []
    //we can call the next() to add data to the BS
    private productsSubject = new BehaviorSubject<Product[]>([]);

    public products$: Observable<Product[]> = this.productsSubject.asObservable();
    public selectedCategory = new BehaviorSubject<string>('');
    public selectedSort = new BehaviorSubject<string>('');

    constructor(private http: HttpClient) {
        this.loadAllProducts();
    }


    private loadAllProducts() {
        this.http.get<Product[]>(this.apiUrl).subscribe(products => {
            this.productsSubject.next(products);
        });
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProductById(id: number): Observable<Product> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Product>(url);
    }

    addProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + '/addproduct', product,{headers});
    }

    // updateProduct(product: Product): Observable<Product> {
    //     const url = `${this.apiUrl1}/${product.id}`;
    //     return this.http.put<Product>(url, product).pipe(tap(() => this.loadAllProducts()));
    // }

    updateProduct(product: Product): Observable<Product> {
        const url = `${this.apiUrl}/${product.id}`;
        return this.http.put<Product>(url, product).pipe(tap(() => this.loadAllProducts()));
    }

    // deleteProduct(id: number) {
    //     const url = `${this.apiUrl}/${id}`;
    //     return this.http.delete<any>(url).pipe(tap(() => this.loadAllProducts()));
    // }

     getCategory() {
        const url = `${this.apiUrl  + '/category'}`;
        return this.http.get<any>(url);
    }

    getAllProducts() {
        const url = `${this.apiUrl  + '/'}`;
        return this.http.get<any>(url);
    }

    getProductByCategory(id:number) {
        const url = `${this.apiUrl  + '/category'}/${id}`;
        console.log(url)
        return this.http.get<any>(url);
    }

    deleteProductsById(id:number) {
        const url = `${this.apiUrl1}/${id}`;
        return this.http.delete<any>(url);
    }

    deletecategoryById(id:number) {
        const url = `${this.apiUrl  + '/category'}/${id}`;
        return this.http.delete<any>(url);
    }


   addCategory(category: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + '/AddCategory', category,{headers});
    }

    updateCategory(category: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(this.apiUrl + '/category/update', category,{headers});
    }

}