import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderService } from '../services/order.service';
import { FindUserNamePipe } from '../core/findUsername.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    OrderCreateComponent,
    OrderEditComponent,
    OrderListComponent,
    FindUserNamePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    OrderCreateComponent,
    OrderEditComponent,
    OrderListComponent
  ],
  providers: [OrderService]
})
export class OrdersModule { }
