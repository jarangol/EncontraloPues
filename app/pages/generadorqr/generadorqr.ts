import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

/*
  Generated class for the GeneradorqrPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/generadorqr/generadorqr.html',
})
export class GeneradorqrPage {
	constructor(private navCtrl: NavController,public platform: Platform) {
  	}	

  public generar(){
  	   this.platform.ready().then(() => {  
  	   		
   			BarcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com");

        });
  	}

  	 public scan(): string {

        this.platform.ready().then(() => {       
			BarcodeScanner.scan().then((barcodeData) => {
				 alert(barcodeData.text);
         return barcodeData.text;
			}, (err) => {
			    alert("Ha ocurrido un error: "+err);
			}); 
        });
        return "";
    }

}
