import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-browse-products',
  templateUrl: './browse-products.component.html',
  styleUrls: ['./browse-products.component.css']
})
export class BrowseProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagedProducts: any[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();
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
activeCategoryId: string | null = null;
stars: any;
  loading: any;





  constructor(private productService: ProductService, private cartService: CartService, private toastr: ToastrService,private cd: ChangeDetectorRef) {

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
    this.loading = true;
    setTimeout(() => {
      this.productService.getCategory().subscribe(res => {
        this.categoryList = res.result;
        this.getAllProduct();
      })
      this.loading = false;
    },500); // 2 seconds
  

  }

  getAllProduct(){
    this.productService.getAllProducts().subscribe(res => {
      this.productResponse = res;
      let products = res.result;
      this.products = [];
      for(let i=0;i<products.length;i++){
        products[i]['quantity'] = 0;
        products[i].imageurl = products[i].imageurl.replaceAll('C:\\fakepath\\', '../assets/images/');
        if (products[i]['price'] !== null && products[i]['discount'] !== null) {
          products[i]['discountedAmount'] = ((products[i]['price'] * products[i]['discount']) / 100);
        }
        this.updateStars(products[i].rating)
       if(products[i].status == 'active'){
        this.products.push(products[i]);
       }
       this.updatePagedProducts();

       // Initialize paginator page event subscription after data is set
       if (this.paginator) {
         this.paginator.page.subscribe(() => this.updatePagedProducts());
       }
      }
      
    })
   
  }

  updatePagedProducts() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
    console.log(this.pagedProducts)
  }

  getproductByCategory(id:any){
    this.activeCategoryId = id;
    this.cd.detectChanges(); // Manually trigger change detection
   if(id != ''){
    this.productService.getProductByCategory(id).subscribe(res => {
      this.productResponse = res;
      if(res.result.length > 0){
        this.products = res.result;
        for(let i=0;i<this.products.length;i++){
          this.products[i]['quantity'] = 0;
          this.products[i].imageurl = this.products[i].imageurl.replaceAll('C:\\fakepath\\', '../assets/images/');
          this.updateStars(this.products[i].rating)
        }
        console.log(this.products);
      }else{
        this.toastr.warning('Warning', 'No Item Found', {
          timeOut: 4000,
        });
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

  isActive(categoryId: string): boolean {
    return this.activeCategoryId === categoryId;
  }

  updateStars(rating : any): void {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;
    this.stars = Array(totalStars).fill('fa-star-o'); // Initialize with empty stars

    for (let i = 0; i < fullStars; i++) {
      this.stars[i] = 'fa-star'; // Full stars
    }
    if (hasHalfStar) {
      this.stars[fullStars] = 'fa-star-half-alt'; // Half star
    }
  }

  getStarClass(index: number): string {
    return `fa ${this.stars[index]}`;
  }
  
}
