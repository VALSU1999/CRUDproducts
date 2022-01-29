//IMPORTS NECESARIOS
//nos vas a permiter cargar como servicio el routing
import { ModuleWithProviders } from '@angular/core';
//librerias del routing
import { Routes, RouterModule } from '@angular/router';

//IMPORTAR COMPONENTES
//aqui importamos el fichero con extension .ts para hacer las rutas
import { ListProductComponent } from './components/list-product/list-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { ErrorComponent } from './components/error/error.component';

//DEFINIR LAS RUTAS
const appRoutes: Routes = [
    {path: '', component: ListProductComponent},
    {path: 'list', component: ListProductComponent},
    {path: 'registre', component: CreateProductComponent},
    {path: 'edit/:id', component: CreateProductComponent},
    {path: 'detail', component: DetailProductComponent},
    {path: '**', component: ErrorComponent}
]

//EXPORTAR CONFIGURACION
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
