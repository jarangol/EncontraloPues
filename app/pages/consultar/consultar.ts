import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page} from 'ionic-angular';

//service: 
//import {Registros} from '../../providers/registros/registros';

import { RegistroService} from '../../providers/registro-service/registro-service';

//clase con datos de un registro:
import {RegistroQR} from '../../registroQR';


@Component({ 
   templateUrl: 'build/pages/consultar/consultar.html',
   providers: [RegistroService]
})

export class ConsultarPage {
	errorMessage: string;
  public registros: any;
  //mode = 'Observable';
  
  
  //al recibir registroService deja de funcionar
    constructor(private navCtrl: NavController, public registroService: RegistroService){
      this.loadRegistros();
  }
  
	consultar(){
    alert("consultar .ts");
		/*
    this.registroService.getRegistros().then(data => {       
        console.log(data);
        this.registros = data; 
      });
      //this.registroService.deleteRegistro*(.then((data) => {
        */
   }

   delete(){
     /*
    alert("delete .ts");
      this.registroService.deleteRegistro("id");
      */
   }

	  
   loadRegistros(){
      this.registroService.load()
      .then(data => {
        this.registros = data;
      });
  }
 }

