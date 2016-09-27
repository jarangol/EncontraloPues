import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert,ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})

export class RegistrarPage {
 registro = {};
 
 tags: any;
 descripcion: any;
 codigo: any;

 platform: Platform;
 nav: NavController;

  	logForm(form) {
    console.log(form.value)
  	} 

   static get parameters() {
       return [[Platform], [NavController]];
	}    
  	
 	constructor(platform, navController,public view: ViewController) {
        this.platform = platform;
        this.nav = navController;
        this.registro={codigo: '00000'}
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
      let registro = {
        tags: this.tags,
        descripcion: this.descripcion
      };
      this.view.dismiss(registro);
    }

}
