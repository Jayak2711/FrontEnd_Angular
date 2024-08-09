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
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CategoryComponent } from './category/category.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpInterceptorService } from 'src/http.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { LoaderComponent } from "../loader/loader.component";
import { FooterComponent } from "../footer/footer.component";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotfoundComponent,
    RxjsDemoComponent,
    AccountSettingsComponent,
    CategoryComponent,
    ChangePasswordComponent,
    
    // FilterPipe
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
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatGridListModule,
    LoaderComponent,
    FooterComponent
],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
