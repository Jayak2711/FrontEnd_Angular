import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-browse-products',
  templateUrl: './browse-products.component.html',
  styleUrls: ['./browse-products.component.css']
})
export class BrowseProductsComponent implements OnInit {

  products: any = [];
  filteredAndSortedproducts$!: Observable<Product[]>;
  selectedCategory: string = '';
  selectedSort: string = '';
  categoryList: any;
  userDetails: any;
  selectedQuantity : number = 0
  productResponse: any;
domSanitizer: any;
searchText:any;




  constructor(private productService: ProductService, private cartService: CartService) {

    this.filteredAndSortedproducts$ = combineLatest([
      this.productService.products$,
      this.productService.selectedCategory,
      this.productService.selectedSort
    ]).pipe(map(([products, category, sort]) => this.filterAndSortProducts(products, category, sort)));
  }
  // constructor(private productService: ProductService, private cartService: CartService) {

  // }

  ngOnInit(): void {
    let userDetails : any = sessionStorage.getItem('currentUser');
    this.userDetails = JSON.parse(userDetails);
    this.getAllCategory();
  }


  getAllCategory(){
    this.productService.getCategory().subscribe(res => {
      this.categoryList = res.result;
      this.getAllProduct();
    })
  }

  getAllProduct(){
    this.productService.getAllProducts().subscribe(res => {
      this.productResponse = res;
      this.products = res.result;
      console.log(this.products)
      for(let i=0;i<this.products.length;i++){
        this.products[i]['quantity'] = 0;
      }
      console.log(this.products)
      const blob = new Blob(this.products.image_url)
      console.log(blob)
    })
   
  }


  getproductByCategory(id:any){
    console.log(id)
   if(id != ''){
    this.productService.getProductByCategory(id).subscribe(res => {
      this.productResponse = res;
      if(res.result.length > 0){
        this.products = res.result;
        for(let i=0;i<this.products.length;i++){
          this.products[i]['quantity'] = 0;
        }
      }else{
        this.products = []; 
      }
     
    })
   }else{
    this.getAllProduct();
   }

  }

  onCategoryChange(): void {
    this.productService.selectedCategory.next(this.selectedCategory);
  }

  onSortChange(): void {
    this.productService.selectedSort.next(this.selectedSort);
  }

  private filterAndSortProducts(products: Product[], category: string, sort: string): Product[] {
    let result = category ? products.filter(p => p.category === category) : products;

    result.sort((a, b) => {
      if (sort === 'asc') {
        return a.price - b.price;
      } else if (sort === 'desc') {
        return b.price - a.price;
      }

      return 0;
    })

    return result;
  }
  increaseQuantity(product: Product){
    product.quantity++;
  }

  decreaseQuantity(product: any){
    if(product.quantity >= 1){
      product.quantity--;
    }
  }

  addToCart(product:any){
    product.isInCart = true;
    if( product.quantity == 0){
      alert("Select the quantity")
    }else{
      let cartInsert = {
        'user_id' :  this.userDetails.user_id,
        'p_id' :  parseInt(product.id),
        'quantity'  : product.quantity,
        'created_by' : '2019-06-01 10:53:09',
        'update_by' : '2019-06-01 10:53:09'
      }
      this.cartService.addToCart(cartInsert).subscribe(res => {
        console.log(res)
        if(res.status == '200'){
          alert('Item added to cart');
        }
      });
    }

  }

  removeFromCart(product: Product){
    this.cartService.removeFromCart(product.id);
    product.isInCart = false;
    product.selectedQuantity = 1;
  }


  sortedProducts = [...this.products];
  sortDirection: 'asc' | 'desc' = 'asc';

  sortByPrice(value : string) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortedProducts = [...this.products].sort((a, b) => {
      return this.sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }
  
}
