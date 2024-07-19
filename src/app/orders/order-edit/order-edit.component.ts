import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {

  orderForm: FormGroup;
  availableProducts: Product[] = [];
  orderId!: number;

  constructor(private fb: FormBuilder, private productService: ProductService, private orderService: OrderService, private router: Router, private route: ActivatedRoute) {
    this.orderForm = this.fb.group({
      userId: [''],
      products: this.fb.array([]),
      totalPrice: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //orders/edit/23
    this.orderId = this.route.snapshot.params["id"];
    this.loadOrder(this.orderId);

    this.productService.getProducts().subscribe(products => {
      this.availableProducts = products;
    });

  }

  loadOrder(id: number) {
    this.orderService.getOrderById(id).subscribe(order => {
      this.orderForm.patchValue({
        userId: order.userId,
        totalPrice: order.totalPrice,
        date: order.date,
        status: order.status
      });

      order.products.forEach(product => {
        this.products.push(this.fb.group({
          productId: [product.productId, Validators.required],
          quantity: [product.quantity, [Validators.required, Validators.min(1)]]
        }));
      })
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

  updateOrder() {
    if (this.orderForm.valid) {
      this.orderService.updateOrder(this.orderId, this.orderForm.value).subscribe(order => {
        this.router.navigate(['/orders']);
      });
    }
  }
}
