import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { RouterModule } from '@angular/router';
import { DisableButtonDirective } from '../core/disable-button.directive';



@NgModule({
  declarations: [
    ShoppingCartComponent,
    ThankYouComponent,
    DisableButtonDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ShoppingCartComponent,
    ThankYouComponent
  ]
})
export class CartModule { }
