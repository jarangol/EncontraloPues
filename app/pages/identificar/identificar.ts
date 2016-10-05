import { Component } from '@angular/core';
import { NavController, Platform, Alert } from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

/*
  Generated class for the IdentificarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/identificar/identificar.html',
})
export class IdentificarPage {

  constructor(private navCtrl: NavController, public platform:Platform) {

  }

  scan() {
        this.platform.ready().then(() => {       
			BarcodeScanner.scan().then((barcodeData) => {
				 alert(barcodeData.text);
			}, (err) => {
			    alert("Ha ocurrido un error: "+err);
			}); 
        });
    }

  ionViewLoaded(){
       this.scan();
    }
}
