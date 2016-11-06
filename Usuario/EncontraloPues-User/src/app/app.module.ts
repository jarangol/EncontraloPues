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
    TabsPage
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    Generarqr
  ]
})
export class AppModule {}
