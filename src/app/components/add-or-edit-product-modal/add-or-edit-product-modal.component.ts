import { CategoriesService } from './../../services/categories.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productForm: FormGroup;
  categories: Category[];
  categorySub: Subscription;
  idCategory = 1;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) {
    this.productForm = fb.group({
      productInfos: fb.group({
        name: ['',Validators.required],
        description: ['',Validators.required],
        price: ['',Validators.required],
        stock: ['',Validators.required]
      }),
      illustration: fb.group({
        image: ['',Validators.required]
      })
    })
   }

   selectCategory(id: number){
    this.idCategory = id;
   }

  get isProductInfosInvalid(): boolean{
    return this.productForm.get('productInfos').invalid;
  }

  get isIllustrationInvalid(): boolean{
    return this.productForm.get('illustration').invalid;
  }

  handleCancel(){
    this.finish.emit();
    this.close();
  }

  handleFinish(){
    const product = {
      ...this.productForm.get('productInfos').value,
      ...this.productForm.get('illustration').value,
      category: this.idCategory
    }


    this.finish.emit(product);
    this.close();
  }

  close(){
    this.productForm.reset();
    this.idCategory = 1;
  }


  ngOnInit(): void {
    this.categorySub = this.categoriesService.getCategory().subscribe(
      (response)=>{
        this.categories = response.result;
        //console.log(this.categories);
      }
    )
  }

  ngOnDestroy(): void{
    this.categorySub.unsubscribe();
  }

}
