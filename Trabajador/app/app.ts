import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//paginas

//trabajador
import { ConsultarPage} from './pages/trabajador/consultar/consultar';
import { DetalleRetiroPage} from './pages/trabajador/detalle-retiro/detalle-retiro';
import { RegistrarPage} from './pages/trabajador/registrar/registrar';
import { RetirarPage} from './pages/trabajador/retirar/retirar';
import {  ReclamadosPage } from './pages/trabajador/reclamados/reclamados';

//usuario
import { IdentificarPage } from './pages/usuario/identificar/identificar';
import {  GeneradorqrPage } from './pages/usuario/generadorqr/generadorqr';
import { Objetos} from './pages/usuario/objetos/objetos'

//lugar
import {BuscarLugarPage} from './pages/lugar/buscar-lugar/buscar-lugar'

//paginas generales
import { Login } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { Page2 } from './pages/page2/page2';

//providers
import { RegistroService} from './providers/registro-service/registro-service';
import { RetirarService} from './providers/retirar-service/retirar-service';
import { LogInService } from './providers/logIn-service/logIn-service';

@Component({
  templateUrl: 'build/app.html'
  ,providers: [RegistroService, RetirarService, LogInService]
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
      { title: 'Reclamados', component: ReclamadosPage },
      { title: 'Login', component: Login},
      //{ title: 'Page2', component: Page2 },
      { title: 'Objetos', component: Objetos },
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
