import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//paginas
import { ConsultarPage} from './pages/consultar/consultar';
import { DetalleRetiroPage} from './pages/detalle-retiro/detalle-retiro';
import { HomePage } from './pages/home/home';
import { IdentificarPage } from './pages/identificar/identificar';
import { Page2 } from './pages/page2/page2';
import { RegistrarPage} from './pages/registrar/registrar';
import { RetirarPage} from './pages/retirar/retirar';
import {  GeneradorqrPage } from './pages/generadorqr/generadorqr';
import {  ReclamadosPage } from './pages/reclamados/reclamados';
import {BuscarLugarPage} from './pages/lugar/buscar-lugar/buscar-lugar';


//providers
import { RegistroService} from './providers/registro-service/registro-service';
import { RetirarService} from './providers/retirar-service/retirar-service';

@Component({
  templateUrl: 'build/app.html'
  ,providers: [RegistroService, RetirarService]
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RetirarPage;
  
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
       { title: 'Registrar', component: RegistrarPage},
      { title: 'Buscar trabajador', component: RetirarPage},
        { title: 'Buscar Lugar', component: BuscarLugarPage},
      { title: 'Detalle', component: DetalleRetiroPage} ,
      //{ title: 'Generar', component: GeneradorqrPage} ,
      { title: 'Consultar', component: ConsultarPage},
     // { title: 'Page2', component: Page2 },
      { title: 'Reclamados', component: ReclamadosPage }
     
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }


   ionViewLoaded(){
    }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);

