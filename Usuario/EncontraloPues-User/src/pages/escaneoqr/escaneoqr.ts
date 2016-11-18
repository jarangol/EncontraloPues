import { Component } from '@angular/core';
import { NavController, Platform, Alert } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Qrnotificator } from '../../providers/qrnotificator';
import { AuthService } from '../../services/auth/auth.service';



/*
  Generated class for the Escaneoqr page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-escaneoqr',
  templateUrl: 'escaneoqr.html',
  providers: [Qrnotificator]
})

export class Escaneoqr {

  codigoQR: string;
  qrToggle: any;
  usuario: any;
  resulConsulta: any;

  constructor(public platform: Platform, public navCtrl: NavController,
    public qrService: Qrnotificator, public auth: AuthService) {
    this.usuario = auth.user;
  }

  ionViewDidLoad() {
    console.log('Hello Escaneoqr Page');
  }

  public scan() {
    if (this.auth.authenticated()) {
      this.platform.ready().then(() => {
        BarcodeScanner.scan().then((barcodeData) => {
          alert("scan");
          alert(barcodeData.text);
          this.codigoQR = barcodeData.text;
          // alert(barcodeData.text);

          let consulta = {
            correoUsuario: this.usuario.email,
            codigoQR : barcodeData.text
          }

          this.qrService.notificarQr(consulta).subscribe((data) =>
            {
                    // alert(data.mensaje);
            });

        }, (err) => {
          alert("Ha ocurrido un error: " + err);
        });
      });
    } else {
      alert("Tienes que iniciar sesion");
    }

  }


}
