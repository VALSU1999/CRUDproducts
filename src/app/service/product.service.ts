import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore) {   }

  addProduct(product: any): Promise<any>{
    return this.firestore.collection('products').add(product);
  }

  listProduct(): Observable<any>{
    return this.firestore.collection('products',ref => ref.orderBy("createDate",'desc')).snapshotChanges();
  }
  deleteProduct(id: string): Promise<any>{
    return this.firestore.collection('products').doc(id).delete();
  }

  getProduct(id: string): Observable<any>{
    return this.firestore.collection('products').doc(id).snapshotChanges();
  }
 
  updateProduct(id: string, data: any): Promise<any>{
    return this.firestore.collection('products').doc(id).update(data);
  }
}
