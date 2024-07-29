import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: any;
  categoryResult: any;
  constructor(private fb: FormBuilder,private http : ProductService,private spinner: NgxSpinnerService){
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
      this.categoryResult['isEditing'] = false
    })
  }


  deleteProduct(id:number){
    this.http.deletecategoryById(id).subscribe(res => {
      console.log(res)
      if(res.status == '200'){
      }
    })
  }

  updateCategory(data : any){
    data.isEditing = true;
  }

  saveCategory(data:any){
    this.spinner.show();
    setTimeout(()=>{
      this.http.updateCategory(data).subscribe(res => {
        if(res.status == '200'){
          data.isEditing = false;
          this.spinner.hide();
        }
      })
    },500)

  }

}
