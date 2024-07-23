import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {

  productForm: any;
  categoryList: any;
  categorySelected: any;
  file: any;
  submitted: boolean = false;

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router,public domSanitizer: DomSanitizer) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      categoryId: [0, Validators.required],
      imageUrl: ['', Validators.required],
      created_by:[new Date()],
      updated_by:[''],
      status:['Available']

    });
  }

  ngOnInit(){
    this.getAllCategory();
  }

  createProduct() {
    console.log(this.productForm)
    this.submitted  = true;
    const formData = new FormData();
    console.log("this.file.name",this.file.name);
    formData.append("image", this.file, this.file.name);
    console.log(formData)
    if (this.productForm.valid) {

      this.productService.addProduct(this.productForm.value).subscribe(product => {
        console.log("product created", product);
        this.router.navigate(['/products']);
      });
    }
  }

  getAllCategory(){
    this.productService.getCategory().subscribe(res => {
      console.log("this.categorylist",res.result);
      this.categoryList = res.result;
    })
  }

  get f() {
    return this.productForm.controls;
  }
  uploadImage(event:any){
    this.file = event.target.files[0];
    console.log(this.file);
  }
}
