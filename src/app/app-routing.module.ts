import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { OrderCreateComponent } from './orders/order-create/order-create.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { NoAccessComponent } from './auth/no-access/no-access.component';
import { ShoppingCartComponent } from './cart/shopping-cart/shopping-cart.component';
import { BrowseProductsComponent } from './products/browse-products/browse-products.component';
import { ThankYouComponent } from './cart/thank-you/thank-you.component';
import { HomeComponent } from './home/home.component';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RxjsDemoComponent } from './rxjs-demo/rxjs-demo.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CategoryComponent } from './category/category.component';
import { ModalBuyNowComponent } from './cart/modal-buy-now/modal-buy-now.component';


const routes: Routes = [
  { path: 'products/create', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:id', component: ProductEditComponent, canActivate: [AuthGuard] },
  { path: 'orders/create', component: OrderCreateComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard] },
  { path: 'orders/edit/:id', component: OrderEditComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: ShoppingCartComponent},
  { path: 'payment', component: ModalBuyNowComponent},
  { path: 'browse-products', component: BrowseProductsComponent },
  { path: 'cart/thank-you', component: ThankYouComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'rxjs-demos', component: RxjsDemoComponent},
  { path: 'history', component: OrderHistoryComponent},
  { path: 'settings', component: AccountSettingsComponent},
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
