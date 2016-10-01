import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
import {Registros} from '../../providers/registros/registros';

@Component({ 
   templateUrl: 'build/pages/consultar/consultar.html'
})

export class ConsultarPage {
	registros: any;
  
  static get parameters() {
     return [[Platform], [NavController]];
  }


  //al recibir registroService deja de funcionar
    constructor(public navCtrl: NavController, private registroService: Registros) {
      
      let registro1= {
        tags: 'tags1',
        descripcion: 'descripcion1'
      };

      let registro2 = {
        tags: 'tags2',
        descripcion: 'descripcion2'
      };

      var nose = {registro1, registro2};
     
  }
  
  
	ionViewLoaded(){
		//this.registroService.getData().then((data) => {
    this.registroService.getRegistros().then((data) => {
            console.log(data);
            this.registros = data; 
      });
   }
	
 }

