import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//importamos el fichero app.routing.ts
import { routing, appRoutingProviders} from './app.routing';

//modulos
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ErrorComponent } from './components/error/error.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';


import { ReactiveFormsModule } from '@angular/forms';

import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({

  declarations: [
    AppComponent,
    ListProductComponent,
    CreateProductComponent,
    ErrorComponent,
    DetailProductComponent

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    routing,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxDropzoneModule
  ],
  providers: [AngularFirestore,
    appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
