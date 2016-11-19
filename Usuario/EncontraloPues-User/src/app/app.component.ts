import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../services/auth/auth.service';

//pages
import { PingPage } from '../pages/ping/ping';
import { ProfilePage } from '../pages/profile/profile';
import { Escaneoqr } from '../pages/escaneoqr/escaneoqr';
import { Agregarobjts } from '../pages/agregarobjts/agregarobjts';
import { Generadorqr } from '../pages/generadorqr/generadorqr';
import { Objetos } from '../pages/objetos/objetos';
import { Buscarobjetos } from '../pages/buscarobjetos/buscarobjetos';
import { Encontrados } from '../pages/encontrados/encontrados';
import { Notificationes } from '../pages/notificationes/notificationes';
import { Usuarioprovider } from '../providers/usuarioprovider';
import { EliminarObjt } from '../pages/eliminar-objt/eliminar-objt';
//

@Component({
  templateUrl: 'app.html',
  providers: [Usuarioprovider]
})

export class AuthApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Buscarobjetos;
  pages: Array<{ title: string, component: any }>;
  usuario: any;
  resulConsulta: any;


  constructor(platform: Platform, private auth: AuthService,
    private usuarioProvider: Usuarioprovider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // Schedule a token refresh on app start up
      auth.startupTokenRefresh();
      Splashscreen.hide();
      this.usuario = auth.user;
      this.insertarUsuario();
    });

    this.pages = [
      { title: 'Sesion', component: ProfilePage },
      { title: 'Escanea el QR', component: Escaneoqr },
      { title: 'Buscar', component: Buscarobjetos },
      { title: 'Notificaciones', component: Notificationes },
      { title: 'Tus Objetos', component: Objetos }
    ];


  }

  ionViewWillEnter() { // se llama todo lo que se quiere que se refreseque en la pag
    this.insertarUsuario();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public insertarUsuario() {
    if (this.auth.authenticated()) {
      let consulta = {
        correoUsuario: this.usuario.email,
        nombre: this.usuario.nickname
      }

      console.log(this.usuario.email + " insertar usuario ");
      console.log(this.usuario.nickname + " insertar usuario ");

      this.usuarioProvider.ingresarUsuario(consulta).subscribe((data) => {
        // this.resulConsulta = data;
        if (data.correcto) {
          this.resulConsulta = data.mensaje;
        } else {
          alert(data.mensaje);
        }
      });
    }
  }


}
