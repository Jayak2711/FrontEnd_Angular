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
  categoryList: any;

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      id:[],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.required, Validators.min(1)]],
      rating: ['', [Validators.required, Validators.min(1)]],
      seller: ['', Validators.required],
      categoryid: [1005, Validators.required],
      imageurl: ['', Validators.required],
      createdby:[''],
      updatedby:[new Date()],
      status:['active',Validators.required],
    })
  }

  ngOnInit(): void {
    this.productService.getProductById(this.route.snapshot.params["id"]).subscribe((product : any) => {
      console.log(product.result)
      this.productForm.patchValue(product.result);
      console.log(this.productForm)
      this.getAllCategory()
  })
  
  }


  getAllCategory(){
    this.productService.getCategory().subscribe(res => {
      console.log("this.categorylist",res.result);
      this.categoryList = res.result;
    })
  }

  onSelectChange(eve :any){
    const target = eve.target as HTMLSelectElement;
    target.value;
  }


  updateProduct(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value).subscribe(product => {
        this.router.navigate(['/products']);
      });
    }
  }
}
