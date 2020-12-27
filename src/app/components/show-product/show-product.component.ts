import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  @Input() products: Product[];
  productModalOpen = false;
  selectedProduct: Product;
  file: File;
  progress = 0;

  constructor(private productService: ProductsService,private fileService: FileUploadService) { }

  ngOnInit(): void {
  }

  onEdit(product: Product):void {
    this.productModalOpen = true;
    this.selectedProduct = product;

  }

  onDelete(product: Product): void{

  }

  addProduct():void {
    this.productModalOpen = true;
  }

  handleFinish(event){
    if(event && event.product){
      let product = event.product ? event.product : null;
      this.file = event.file ? event.file : null;
      console.log(product);
      if(this.selectedProduct){
        //Edit Product
      }else{
        //Add Product
        this.productService.addProduct(product).subscribe(
          (data)=>{
            if(data.status == 200){
              // Update frontend
              if(this.file){
                this.fileService.uploadImage(this.file).subscribe(
                  (event: HttpEvent<any>)=>{
                    switch (event.type) {
                      case HttpEventType.Sent:
                        console.log("Requete envoyée avec succès");
                        break;
                      case HttpEventType.UploadProgress:
                        this.progress = Math.round(event.loaded / event.total * 100);
                        break;
                      case HttpEventType.Response:
                        console.log(event.body);
                        setTimeout(() => {
                          this.progress = 0;
                        }, 1500);

                    }
                  }
                )
              }
              product.idProduct = data.args.lastInsertId;
              this.products.push(product);
            }

          }
        )
      }
    }
    this.productModalOpen = false;
  }

}
