import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//paginas

//trabajador
import { RegistrarPage} from './pages/trabajador/registrar/registrar';
import { RetirarPage} from './pages/trabajador/retirar/retirar';
import { RetiradosPage } from './pages/trabajador/retirados/retirados';

//lugar
import {BuscarLugarPage} from './pages/lugar/buscar-lugar/buscar-lugar'
import {TrabajadoresPage} from './pages/lugar/trabajadores/trabajadores'
import {TrabajadorPage} from './pages/lugar/trabajador/trabajador'

//paginas generales
import { Login } from './pages/login/login';

//providers
import { RegistroService} from './providers/registro-service/registro-service';
import { RetiradosService} from './providers/retirados-service/retirados-service';
import { RetirarService} from './providers/retirar-service/retirar-service';
import { LogInService } from './providers/logIn-service/logIn-service';


@Component({
  templateUrl: 'build/app.html'
  ,providers: [RegistroService, RetirarService, LogInService, RetiradosService]
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RegistrarPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
       { title: 'Registrar', component: RegistrarPage},
       { title: 'Retirar', component: RetirarPage},
      { title: 'Retirados', component: RetiradosPage },
      { title: 'Login', component: Login},
      { title: 'trabajadores', component: TrabajadoresPage},
       { title: 'trabajador', component: TrabajadorPage},
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
