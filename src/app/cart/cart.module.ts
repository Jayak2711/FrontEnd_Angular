import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { RouterModule } from '@angular/router';
import { DisableButtonDirective } from '../core/disable-button.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShoppingCartComponent,
    ThankYouComponent,
    DisableButtonDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    ShoppingCartComponent,
    ThankYouComponent
  ]
})
export class CartModule { }
