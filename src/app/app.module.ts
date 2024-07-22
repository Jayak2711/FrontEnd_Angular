import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CoreModule } from './core/core.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { HomeComponent } from './home/home.component';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotfoundComponent,
    RxjsDemoComponent,
    OrderHistoryComponent,
    AccountSettingsComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CartModule,
    CoreModule,
    FormsModule,
    OrdersModule,
    ProductsModule,
    ToastrModule.forRoot(), 
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
