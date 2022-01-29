import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, retry } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { environment } from 'src/environments/environment';


firebase.initializeApp(environment.firebaseConfig);


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  

  constructor(private firestore: AngularFirestore) {   }
  storareRef = firebase.app().storage().ref();
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

  async addImage(name:string, imgBase64: any){
    try {
        let resp = await this.storareRef.child("image/"+name).putString(imgBase64,'data_url');
        return await resp.ref.getDownloadURL();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}
