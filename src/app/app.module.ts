import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';


registerLocaleData(localeEs,'es');
const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path:'clientes/form',component:FormComponent},
  {path:'clientes/form/:id',component:FormComponent},
  {path:'login',component:LoginComponent},
  //{path:'clientes/ver/:id',component:DetalleComponent},
  {path:'**',redirectTo:'/clientes'}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent, 
    ClientesComponent,  
    FormComponent, PaginatorComponent, DetalleComponent, LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ClienteService, {provide:LOCALE_ID, useValue:'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
