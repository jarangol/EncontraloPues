import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AuthApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { PingPage } from '../pages/ping/ping';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/auth/auth.service';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Escaneoqr } from '../pages/escaneoqr/escaneoqr';
import { Agregarobjts } from '../pages/agregarobjts/agregarobjts';
import { Generarqr } from '../providers/generarqr/generarqr';
import { Generadorqr } from '../pages/generadorqr/generadorqr';
import { Objetos } from '../pages/objetos/objetos';
import { Buscarobjetos } from '../pages/buscarobjetos/buscarobjetos';
import { Encontrados } from '../pages/encontrados/encontrados';
import { Notificationes } from '../pages/notificationes/notificationes';
import { Usuarioprovider } from '../providers/usuarioprovider';
import { EliminarObjt } from '../pages/eliminar-objt/eliminar-objt';
import { Encontradosconsecutivo } from '../pages/encontradosconsecutivo/encontradosconsecutivo';






let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    AuthApp,
    ProfilePage,
    PingPage,
    Escaneoqr,
    Agregarobjts,
    Generadorqr,
    Objetos,
    Buscarobjetos,
    Encontrados,
    Notificationes,
    EliminarObjt,
    Encontradosconsecutivo,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(AuthApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthApp,
    ProfilePage,
    PingPage,
    Escaneoqr,
    Agregarobjts,
    Generadorqr,
    Objetos,
    Buscarobjetos,
    Encontrados,
    Notificationes,
    EliminarObjt,
    Encontradosconsecutivo,    
    TabsPage
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    Generarqr,
    Usuarioprovider,
  ]
})

export class AppModule {}
