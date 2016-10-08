import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//paginas
import { BuscarPage} from './pages/buscar/buscar';
import { ConfirmarRetiroPage} from './pages/confirmar-retiro/confirmar-retiro';
import { ConsultarPage} from './pages/consultar/consultar';
import { DetalleRetiroPage} from './pages/detalle-retiro/detalle-retiro';
import { HomePage } from './pages/home/home';
import { IdentificarPage } from './pages/identificar/identificar';
import { Page2 } from './pages/page2/page2';
import { RegistrarPage} from './pages/registrar/registrar';
import { RetirarPage} from './pages/retirar/retirar';


//providers
import { Registros} from './providers/registros/registros';
import { RegistroService} from './providers/registro-service/registro-service';


@Component({
  templateUrl: 'build/app.html'
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RegistrarPage
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Inicio', component: HomePage },
      //{ title: 'Buscar', component: BuscarPage},
      //{ title: 'Confirmar retiro', component:  ConfirmarRetiroPage},
      //{ title: 'Consultar', component: ConsultarPage},
      //{ title: 'Detalle Retiro', component: DetalleRetiroPage},
      //{ title: 'Identificar', component: IdentificarPage},
      //{ title: 'Page2', component: Page2 },
     // { title: 'Retirar', component: RetirarPage}
      { title: 'Registrar', component: RegistrarPage}
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

