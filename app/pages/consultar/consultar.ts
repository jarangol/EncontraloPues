import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
//service: 
import {Registros} from '../../providers/registros/registros';
//clase con datos de un registro:
import {Registro} from '../../registro';


@Component({ 
   templateUrl: 'build/pages/consultar/consultar.html'
})



export class ConsultarPage {
	errorMessage: string;
  registros =[
      { tags: 'tags', descripcion: 'Mr. Nice' },
      { tags: 'tags', descripcion: 'Narco' },
      { tags: 'tags', descripcion: 'Bombasto' },
      { tags: 'tags', descripcion: 'Celeritas' },
      { tags: 'tags', descripcion: 'Magneta' },
      { tags: 'tags', descripcion: 'RubberMan' },
      { tags: 'tags', descripcion: 'Dynama' },
      { tags: 'tags', descripcion: 'Dr IQ' },
      { tags: 'tags', descripcion: 'Magma' },
      { tags: 'tags', descripcion: 'Tornado' }

  ];
  mode = 'Observable';
  
  


  static get parameters() {
     return [[Platform], [NavController]];
  }


  //al recibir registroService deja de funcionar
    constructor(public navCtrl: NavController, public registroService: Registros){
     
  }
  
  getData():void{
      this.registroService.getData().then(registros => this.registros = registros);
  }
  
	boton(){
		//this.registroService.getData().then((data) => {
      alert("boton presionado");
      console.log("Consultar oprimido");
      
      this.registroService.deleteRegistro("hola");//;.then((data) => {
            //console.log(data);
            //this.registros = data; 
      //});
      console.log("Consultar oprimido2");
      
   }

   ionViewLoaded(){
       //this.getData();
    }
	
 }

