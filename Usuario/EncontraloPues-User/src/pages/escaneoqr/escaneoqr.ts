import { Component } from '@angular/core';
import { NavController,Platform, Alert } from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';


/*
  Generated class for the Escaneoqr page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-escaneoqr',
  templateUrl: 'escaneoqr.html'
})
export class Escaneoqr {

  codigoQR: string;

  constructor(public platform: Platform,public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Escaneoqr Page');
  }

  public scan(): string {
    this.platform.ready().then(() => {
      BarcodeScanner.scan().then((barcodeData) => {
        alert("scan");
        alert(barcodeData.text);
        this.codigoQR = barcodeData.text;
        return barcodeData.text;
      }, (err) => {
        alert("Ha ocurrido un error: " + err);
      });
    });
    return "";
  }


}
