import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  orderForm: FormGroup;
  availableProducts: Product[] = [];

  constructor(private fb: FormBuilder, private orderService: OrderService, private productService: ProductService, private authService: AuthService, private router: Router) {
    this.orderForm = this.fb.group({
      userId: [],
      products: this.fb.array([
        this.fb.group({
          productId: ['', Validators.required],
          quantity: ['', [Validators.required, Validators.min(1)]]
        })
      ]),
      totalPrice: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.availableProducts = products;
    });
  }

  get products() {
    return this.orderForm.get('products') as FormArray;
  }

  addProduct() {
    this.products.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    }));
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  updateTotalPrice() {
    let totalPrice = 0;

    this.products.controls.forEach(control => {
      const quantity = control.get('quantity')?.value;
      const selectedProductId = control.get('productId')?.value;

      const productPrice = this.availableProducts.find(p => p.id === Number(selectedProductId))?.price || 0;

      totalPrice += quantity * productPrice;
    })

    this.orderForm.get('totalPrice')?.setValue(totalPrice);
  }

  createOrder() {
    if (this.orderForm.valid) {
      this.orderForm.value.userId = this.authService.getCurrentUser()?.id;

      this.orderService.createOrder(this.orderForm.value).subscribe(order => {
        this.router.navigate(['/orders']);
      });
    }
  }
}
