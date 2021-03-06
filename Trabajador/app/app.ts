import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//paginas

//trabajador
import { RegistrarPage} from './pages/trabajador/registrar/registrar';
import { RetirarPage} from './pages/trabajador/retirar/retirar';
import { RetiradosPage } from './pages/trabajador/retirados/retirados';
import { CuentaPage } from './pages/trabajador/cuenta/cuenta';

//lugar
import {BuscarLugarPage} from './pages/lugar/buscar-lugar/buscar-lugar';
import {PuntosRecoleccionPage} from './pages/lugar/puntos-recoleccion/puntos-recoleccion';
import {TrabajadoresPage} from './pages/lugar/trabajadores/trabajadores';

//paginas generales
import { Login } from './pages/login/login';
//import {CuentaLugarPage} from './pages/lugar/cuenta/cuenta';

//providers
import { RegistroService} from './providers/registro-service/registro-service';
import { RetiradosService} from './providers/retirados-service/retirados-service';
import { RetirarService} from './providers/retirar-service/retirar-service';
import { LogInService } from './providers/logIn-service/logIn-service';
import { LugarService } from './providers/lugar-service/lugar-service';

@Component({
  templateUrl: 'build/app.html'
  ,providers: [RegistroService, RetirarService, LogInService, RetiradosService]
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Login;

  trabajadorPages: Array<{title: string, component: any}>;
  lugarPages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // paginas del trabajador
    this.trabajadorPages = [
      { title: 'Inicio', component: CuentaPage},
      { title: 'Registrar', component: RegistrarPage},
      { title: 'Retirar', component: RetirarPage},
      { title: 'Historial de retiros', component: RetiradosPage },
      { title: 'Cerrar sesión', component: Login }
    ];

      this.lugarPages = [
        { title: 'Buscar', component: BuscarLugarPage },
        { title: 'Trabajadores', component: TrabajadoresPage },
        { title: 'Puntos Recoleccion', component: PuntosRecoleccionPage },
        { title: 'Cerrar sesión', component: Login },
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
