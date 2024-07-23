import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: any;
  categoryResult: any;
  constructor(private fb: FormBuilder,private http : ProductService){
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  ngOnInit(){
    this.getAllCategory();
  }

  createCategory(){
    this.http.addCategory(this.categoryForm.value).subscribe(res =>{
      if(res.status == "200"){
        // this.categoryForm.rest();
        this.getAllCategory();
      }
      console.log(res)
    })
  }

  getAllCategory(){
    this.http.getCategory().subscribe(res => {
      this.categoryResult = res.result;
    })
  }


  deleteProduct(id:number){
    this.http.deletecategoryById(id).subscribe(res => {
      console.log(res)
      if(res.status == '200'){
        alert()
      }
    })
  }

}
