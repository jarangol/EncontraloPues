import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})

export class RegistrarPage {
 registro = {};
 codigo: string;
  logForm(form) {
    console.log(form.value)
  } 

  constructor(private navCtrl: NavController){
	this.registro={codigo: '00000'};

}  	
 
}
