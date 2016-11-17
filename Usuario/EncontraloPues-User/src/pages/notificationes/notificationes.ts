import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { Notificacionesprovider } from '../../providers/notificacionesprovider';


/*
  Generated class for the Notificationes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notificationes',
  templateUrl: 'notificationes.html',
  providers: [Notificacionesprovider],
})
export class Notificationes {
  notificaciones: any = [];
  usuario: any;
  resulConsulta: any;
  constructor(public navCtrl: NavController, public auth: AuthService,
    private notiservice: Notificacionesprovider, public alertCtrl: AlertController) {
    this.usuario = auth.user;
  }



  ionViewDidLoad() {
    console.log('Hello Notificationes Page');
  }

  ionViewWillEnter() { // se llama todo lo que se quiere que se refreseque en la pag
    this.obtenerNotificaciones();
  }

  public obtenerNotificaciones() {
    if (this.auth.authenticated()) {
      let consulta = {
        correoUsuario: this.usuario.email
      }

      this.notiservice.obtenerNotificaciones(consulta).subscribe((data) => {
        // this.resulConsulta = data;
        if (data.correcto) {
          this.resulConsulta = data.mensaje;
        } else {
          alert(data.mensaje);
        }
      });

    }
  }

  showAlert(notificacion) {
    let alert = this.alertCtrl.create({
      title: "Enhorabuena!",
      subTitle: " El correo de la persona que encotro este objeto es "+
      notificacion._id + " el dia " +
      notificacion.objetosPersonales.notificaciones.usuario.fechaRegistro.dia +
      "-" +
      notificacion.objetosPersonales.notificaciones.usuario.fechaRegistro.anoMes +
      " ponte en contacto " + ""  ,
      buttons: ['OK']
    });
    alert.present();
  }

}
