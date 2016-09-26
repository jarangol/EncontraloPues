import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})

export class RegistrarPage {
 registro = {};
 codigo: string;
 platform: Platform;
 nav: NavController;

  	logForm(form) {
    console.log(form.value)
  	} 

   static get parameters() {
       return [[Platform], [NavController]];
	}    
  	
 	constructor(platform, navController) {
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

}
