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
//

@Component({
  templateUrl: 'app.html'
})

export class AuthApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
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
      {title: 'Ping', component: PingPage},
      {title: 'Profile',component: ProfilePage},
      {title: 'Escanea el QR', component: Escaneoqr},
      {title: 'Agrega tu objeto', component: Agregarobjts}      
    ];
  
  }
   
    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
}
