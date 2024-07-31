import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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




  constructor(private productService: ProductService, private cartService: CartService, private toastr: ToastrService) {

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
      let products = res.result;
      for(let i=0;i<products.length;i++){
        products[i]['quantity'] = 0;
        products[i].imageurl = products[i].imageurl.replaceAll('C:\\fakepath\\', '../assets/images/');
       if(products[i].status == 'active'){
        this.products.push(products[i]);
       }
      }
      
      console.log(this.products);
    })
   
  }


  getproductByCategory(id:any){
   if(id != ''){
    this.productService.getProductByCategory(id).subscribe(res => {
      this.productResponse = res;
      if(res.result.length > 0){
        this.products = res.result;
        for(let i=0;i<this.products.length;i++){
          this.products[i]['quantity'] = 0;
        }
      }else{
        this.toastr.warning('Warning', 'No Item Found', {
          timeOut: 4000,
        });
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
    console.log(product)
    product.isInCart = true;
    if(product.quantity == 0){
      this.toastr.error('Error', 'Select quantity before adding to cart', {
        timeOut: 4000,
      });
    }else{
      let cartInsert = {
        'user_id' :  this.userDetails.user_id,
        'p_id' :  parseInt(product.id),
        'quantity'  : product.quantity,
        'created_by' : '2019-06-01 10:53:09',
        'update_by' : '2019-06-01 10:53:09'
      }
      this.cartService.addToCart(cartInsert).subscribe(res => {
        if(res.status == '200'){
          // alert('Item added to cart');
          this.toastr.success('Success', 'Product added to cart', {
            timeOut: 4000,
          });
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
