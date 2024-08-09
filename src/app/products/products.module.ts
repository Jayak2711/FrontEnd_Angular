import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { BrowseProductsComponent } from './browse-products/browse-products.component';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LoaderComponent } from "../../loader/loader.component";
import { OrderHistoryComponent } from '../order-history/order-history.component';
import { FilterPipe } from '../../app/filter.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';  // Import MatSortModule

@NgModule({
  declarations: [
    ProductCreateComponent,
    ProductEditComponent,
    ProductListComponent,
    BrowseProductsComponent,
    FilterPipe,
    OrderHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    LoaderComponent,
    MatCardModule,
    MatSortModule
    
],
  exports: [
    ProductCreateComponent,
    ProductEditComponent,
    ProductListComponent,
    BrowseProductsComponent
  ],
  providers: [ProductService]
})
export class ProductsModule { }
