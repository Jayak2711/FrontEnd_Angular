import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
goBack() {
throw new Error('Method not implemented.');
}

  productForm: FormGroup;
  categoryList: any;

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private changeDef : ChangeDetectorRef) {
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
      status:[false,Validators.required],
    })
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.params["id"])
    this.productService.getProductById(this.route.snapshot.params["id"]).subscribe((product : any) => {
      console.log(product)
      this.productForm.patchValue(product.result);
      this.changeDef.detectChanges();
      this.getAllCategory()
  })
  
  }


  getAllCategory(){
    this.productService.getCategory().subscribe(res => {
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
