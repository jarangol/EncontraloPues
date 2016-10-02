import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { Page2 } from './pages/page2/page2';
import { RegistrarPage} from './pages/registrar/registrar';
import { ConsultarPage} from './pages/consultar/consultar';
import { Registros} from './providers/registros/registros';

@Component({
  templateUrl: 'build/app.html'
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ConsultarPage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Registrar', component: RegistrarPage},
      { title: 'Consultar', component: ConsultarPage},
      { title: 'Page2', component: Page2 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);

