import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';

//service: 
//import {Registros} from '../../providers/registros/registros';

import { RegistroService} from '../../providers/registro-service/registro-service';

import { DetalleRetiroPage} from '../../pages/detalle-retiro/detalle-retiro';

@Component({ 
   templateUrl: 'build/pages/consultar/consultar.html',
   providers: [RegistroService]
})

export class ConsultarPage {
  private registros: any;
  private selectedItem: any;
    //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private nombrePunto: any;
  private codigoBusqueda: any;
  private registro: any;
  private correoTrabajador: any;

  //pertenecen a registro
  private descripcion: string;
  private fecha: any;

  //para dividir la fecha en varios.
  private dia: any;
  private mes: any;
  private año: any;
 
    constructor(private navCtrl: NavController, public registroService: RegistroService, public navParams: NavParams){
     this.loadRegistros();
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto');
      //this.codigoBusqueda = this.navParams.get('codigoBusqueda');  
      this.registros = this.navParams.get('registros');
      this.correoTrabajador = this.navParams.get('correoTrabajador');
  }

	  
   loadRegistros(){
      this.registroService.load()
      .then(data => {
        this.registros = data;
      });
   }

    itemTapped(event, registro) {
      alert("selecciono un registro");
     this.navCtrl.push(DetalleRetiroPage, {
      registro: registro,
      correoLugar: this.correoLugar,
      correoTrabajador: this.correoTrabajador,
      nombrePunto: this.nombrePunto,       
    });
  }


 }

