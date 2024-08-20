import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: any;
  categoryResult: any;
  showAddCat: boolean = false;
loading: boolean = false;
  constructor(private fb: FormBuilder,private http : ProductService,private spinner: NgxSpinnerService,private toastr: ToastrService){
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  ngOnInit(){
    this.loading = true;
    setTimeout(() => {
      this.getAllCategory();
      this.loading = false;
    },1000); // 2 seconds
  }

  createCategory(){
    this.loading = true;
    setTimeout(() => {
      this.http.addCategory(this.categoryForm.value).subscribe(res =>{
        if(res.status == "200"){
          this.categoryForm.reset();
          this.getAllCategory();
        }
      })
      this.loading = false;
    },1000); // 2 seconds
  }

  getAllCategory(){
    this.http.getCategory().subscribe(res => {
      this.categoryResult = res.result;
      this.categoryResult['isEditing'] = false
    })
  }

  addCategory(){
    this.showAddCat = true;
  }


  deleteProduct(id:number){
    setTimeout(() => {
      this.http.deletecategoryById(id).subscribe(res => {
        console.log(res)
        if(res.status == '200'){
          this.toastr.success('Success','Cateegory Deleted Successfully');
          this.ngOnInit();
        }
      })
      this.loading = false;
    },1000); // 2 seconds

  }

  updateCategory(data : any){
    data.isEditing = true;
  }

  saveCategory(data:any){
    this.spinner.show();
    setTimeout(()=>{
      this.http.updateCategory(data).subscribe(res => {
        if(res.status == '200'){
          this.toastr.success('Success','Cateegory Updated Successfully');
          data.isEditing = false;
          this.showAddCat = false;
          this.spinner.hide();
        }
      })
    },500)
  }

}
