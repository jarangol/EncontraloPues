import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../services/auth/auth.service';

//pages
import { PingPage } from '../pages/ping/ping';
import {ProfilePage } from '../pages/profile/profile';
import { Escaneoqr } from '../pages/escaneoqr/escaneoqr';
import { Agregarobjts } from '../pages/agregarobjts/agregarobjts';
import { Generadorqr } from '../pages/generadorqr/generadorqr';
import { Objetos } from '../pages/objetos/objetos';
import { Buscarobjetos } from '../pages/buscarobjetos/buscarobjetos';
import { Encontrados } from '../pages/encontrados/encontrados';

//

@Component({
  templateUrl: 'app.html'
})

export class AuthApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Buscarobjetos;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, private auth: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // Schedule a token refresh on app start up
      auth.startupTokenRefresh();
      Splashscreen.hide();
    });

    this.pages = [
      // {title: 'Ping', component: PingPage},
      {title: 'Sesion',component: ProfilePage},
      {title: 'Escanea el QR', component: Escaneoqr},
      {title: 'Buscar', component: Buscarobjetos}, 
      {title: 'Encontrados', component: Encontrados},                                 
      {title: 'Tus Objetos', component: Objetos}     
    ];
  
  }
   
    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
}
