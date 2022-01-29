import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  createProduct: FormGroup;
  images: any[] = [];
  files: File[] = [];
  submitted = false;
  loading = false;
  messageDate = false;
  getOfferPrice = false;
  getOfferEndDate = false;
  isValue = true;
  isValueSku = false;
  disabledSku = false;

  id: string | null;
  title = 'Crear Producto';

  constructor(
    private fb: FormBuilder,
    private _productService:ProductService,
    private toastr: ToastrService,
    private router: Router ,
    private aRouter: ActivatedRoute) {
    this.createProduct = this.fb.group({
      name: ['',[Validators.required,Validators.pattern(/^[A-Za-z0-9 ]+$/)]],
      description: ['',Validators.required],
      sku: ['',[Validators.required, Validators.min(1),Validators.pattern(/^[0-9]+$/)]],
      salePrice: ['',[Validators.required, Validators.min(1),Validators.pattern(/^^[0-9]+([.])?([0-9]+)?$/)]],
      stock: ['',[Validators.required, Validators.min(1),Validators.pattern(/^[0-9]+$/)]],
      offerPrice: ['',[Validators.min(1),Validators.pattern(/^[0-9]+$/),Validators.nullValidator]],
      offerEndDate: ['',Validators.nullValidator],
      images:['',Validators.nullValidator]
    })



    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.dateChange();
    this.requiredDateOffer();

  }


  ngOnInit(): void {
    this.editProduct();
  }
  requiredDateOffer(){
    this.createProduct.valueChanges.subscribe(val=>{

      if(val.offerEndDate){
        this.getOfferPrice = true;
        this.isValue = false;
      }else{
        this.getOfferPrice = false;
      }

      if(val.offerPrice){
        this.getOfferEndDate = true;
        this.isValue = false;
      }else{
        this.getOfferEndDate = false;
      }

      if(!val.offerPrice && !val.offerEndDate){
        this.isValue = true;
      }

      if(val.offerPrice && val.offerEndDate){
        this.isValue = true;
        this.getOfferPrice = false;
        this.getOfferEndDate = false;
      }
    })
  }

  dateChange(): void {
    this.createProduct.valueChanges.subscribe(val=>{
      const fechaActual = new Date();
      if(val.offerEndDate){
        if (val.offerEndDate > fechaActual.toISOString().split('T')[0]){
          this.messageDate = false;
        } else {
          this.messageDate = true;
        }
      }
    })
  }


  //inicio imagen
	onSelect(event: any) {
    let archivos = event.addedFiles;
    let reader = new FileReader();
    for (let i = 0; i < archivos.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(archivos[i]);
      reader.onloadend = ()=>{
        this.images.push(reader.result);
      }
    }
    
    if (this.files.length < 3 && event.addedFiles.length <3) {
      this.files.push(...event.addedFiles);
      
    }else{
      this.toastr.error('Solo se puede subir 3 imagenes!', 'Limite de Imagen');
    }
	}

	onRemove(event: any) {
		this.files.splice(this.files.indexOf(event), 1);
	}

  //fin imagen

  addProduct(){
      this.submitted= true;
      if(this.createProduct.invalid){
        return;
      }

      if(this.id === null){
        this.register();
      }else{
        this.edit(this.id);
      }

  }


 edit(id: string){
    this.loading= true;
    var hoy = new Date();
    var fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear() + ' - ' +hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();;
    const product: any={
      name: this.createProduct.value.name.trim(),
      description: this.createProduct.value.description.trim(),
      sku: this.createProduct.value.sku,
      salePrice: this.createProduct.value.salePrice,
      stock: this.createProduct.value.stock,
      offerPrice: this.createProduct.value.offerPrice,
      offerEndDate:this.createProduct.value.offerEndDate,
      updateDate: fecha
    }
    this.loading = true;
      this._productService.updateProduct(id,product).then(() => {
        this.toastr.info('El producto se a Modificado con Exito!', 'Modificado',{positionClass: 'toast-bottom-right'});
        this.loading = false;
        this.isValueSku = false;
        this.router.navigate(['/list']);
      })

  }


  listeSku (sku: number) {

    return new Promise((resolve, rejects )=>{
      this._productService.listProduct().subscribe(data =>{
        let skuValue = false;
        data.forEach((element:any) => {
          if(element.payload.doc.data().sku === sku){
            skuValue = true;
          }
        });
        resolve(skuValue);
      });
    })
  }


   async register(){
    var hoy = new Date();
    var fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear() + ' - ' +hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    const product: any={
      name: this.createProduct.value.name.trim(),
      description: this.createProduct.value.description.trim(),
      sku: this.createProduct.value.sku,
      salePrice: this.createProduct.value.salePrice,
      stock: this.createProduct.value.stock,
      offerPrice: this.createProduct.value.offerPrice,
      offerEndDate:this.createProduct.value.offerEndDate,
      createDate: fecha,
      updateDate: fecha,
      images: []

    }
    this.loading = true;


    var successSKU = await this.listeSku(product.sku).then((dato) => dato);

    if(!successSKU){

      let nameImage = product.name+"_"+Date.now();
      for (let i = 0; i < this.images.length; i++) {
        await this._productService.addImage(nameImage,this.images[i]).then(urlImage =>{
           let image = {             
             nameImage: nameImage,
             imgUrl: urlImage
           }
           product.images.push(image);
       });
     }
      this._productService.addProduct(product).then(()=>{
          this.toastr.success('El producto se a registrado con Exito!', 'Registrado',{positionClass: 'toast-bottom-right'});
          this.loading = false;
          this.isValueSku = false;
          this.router.navigate(['/list']);
      }).catch(error => {
        this.toastr.error('El producto no se a creado!', 'Error',{positionClass: 'toast-bottom-right'});
        this.loading = false;
      })



    }else{
      this.toastr.error('Escriba otro SKU para agregar correctamente!', 'SKU repetido',{positionClass: 'toast-bottom-right'});
      this.loading = false;
      this.isValueSku = true;
    }
    this.loading = false;

  }

  editProduct(){

    if(this.id !== null){
      this.loading = true;
      this.disabledSku = true;
      this.title = 'Editar Producto'
      this._productService.getProduct(this.id).subscribe(data => {
          this.createProduct.setValue({
            name: data.payload.data()['name'],
            sku: data.payload.data()['sku'],
            description: data.payload.data()['description'],
            salePrice: data.payload.data()['salePrice'],
            stock: data.payload.data()['stock'],
            offerPrice: data.payload.data()['offerPrice'],
            offerEndDate: data.payload.data()['offerEndDate'],
            images: data.payload.data()['images']
          });
          this.loading = false;
          console.log(data.payload.data()['images'])
      })
      
    }
  }
}
