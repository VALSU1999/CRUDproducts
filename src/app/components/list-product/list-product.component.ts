import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  products: any[] = [];
  notData = false;
  constructor(
    private _productService: ProductService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.listProducts();

  }



  listProducts(){

      this._productService.listProduct().subscribe(data =>{
        this.products=[];
        data.forEach((element:any) => {
          this.products.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          })
        });
      });


  }

  deleteProduct(id: any){
    this._productService.deleteProduct(id).then(()=>{
      this.toastr.error('El producto se elimino con Exito!', 'Eliminado',{positionClass: 'toast-bottom-right'});
    }).catch(error =>{
      console.log(error);
    });
  }
}
