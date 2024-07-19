import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  productForm: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.productService.getProductById(this.route.snapshot.params["id"]).subscribe(product => {
      this.productForm.patchValue(product);
  })
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value).subscribe(product => {
        this.router.navigate(['/products']);
      });
    }
  }
}
