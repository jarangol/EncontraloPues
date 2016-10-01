import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert, ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})

export class RegistrarPage { 
 tags: any;
 descripcion: any;
 codigo: any;

 	logForm(form) {
      console.log(form.value)
 	} 

   static get parameters() {
     return [[Platform], [NavController]];
	}    
  	
 	constructor(public platform: Platform, public navCtrl: NavController){//,public view: ViewController) {
        this.codigo='00000';
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

    confirmar(): void {
      console.log("Si");
      let registro = {
        tags: this.tags,
        descripcion: this.descripcion
      };
      //this.view.dismiss(registro);
    }

}
