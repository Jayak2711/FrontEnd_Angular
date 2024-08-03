import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { BrowseProductsComponent } from './browse-products/browse-products.component';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../../app/filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

// import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    ProductCreateComponent,
    ProductEditComponent,
    ProductListComponent,
    BrowseProductsComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule
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
