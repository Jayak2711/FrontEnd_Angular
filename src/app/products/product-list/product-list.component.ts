import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  filteredAndSortedproducts$!: Observable<Product[]>;
  selectedCategory: string = '';
  selectedSort: string = '';
  productResponse: any;
  products: any;
  userDetails: any;
  categoryList: any;
  noRec: boolean =  false;
  displayedColumns: string[] = ['sno','pid', 'name', 'description', 'price', 'discount', 'stock', 'category', 'seller','star', 'actions', 'status'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  constructor(private productService: ProductService) {
    this.filteredAndSortedproducts$ = combineLatest([
      this.productService.products$,
      this.productService.selectedCategory,
      this.productService.selectedSort
    ]).pipe(map(([products, category, sort]) => this.filterAndSortProducts(products, category, sort)));
  }

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
for (let i = 0; i < this.products.length; i++) {
  this.products[i].imageurl = this.products[i].imageurl.replaceAll('C:\\fakepath\\', '../assets/images');
  this.dataSource = new MatTableDataSource(this.products);

  // Set the sort and paginator
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}
    
    })
   
  }


  getproductByCategory(id:any){
   if(id != ''){
    this.productService.getProductByCategory(id).subscribe(res => {
      this.productResponse = res;
      if(res.result.length > 0){
        this.products = res.result;
        this.noRec = false;
      }else if(res.result.length == 0){
        this.noRec = true;
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

  deleteProduct(productId:any): void {
    console.log(productId)
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProductsById(productId).subscribe((res) => {
        if(res.status == '200'){
          alert("product deleted successfully");
          this.getAllProduct();
        }
       
      });
    }
  }
}
