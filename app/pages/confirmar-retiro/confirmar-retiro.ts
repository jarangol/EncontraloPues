import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';


@Component({
  templateUrl: 'build/pages/confirmar-retiro/confirmar-retiro.html',
})

export class ConfirmarRetiroPage {

//pertenecen a esta vista
private id: any;
private nombre: any;
private telefono: any;

//me los pasan como navParams desde la vista retirar
private correoLugar: any;
private nombrePunto: any;
private codigoBusqueda: any;
private registro: any;
private correoTrabajador: any;

//pertenecen a registro
private tags:any;
private descripcion: string;
private fecha: any;

  constructor(private navCtrl: NavController,public navParams: NavParams,public retirarService: RetirarService) {
  	this.codigoBusqueda=navParams.get('codigoBusqueda');
  	     //    correoLugar: this.correoLugar,
      //    nombrePunto: this.nombrePunto,
      //    correoTrabajador: this.correoTrabajador
            //    codigoBusqueda: this.codigoBusqueda,
  }

  confirmar(){
  	let retiro={
  		codigoBusqueda:this.codigoBusqueda,
  		id: this.id,
  		nombre: this.nombre,
  		telefono: this.telefono,
  		// nico esto si? nombrelugar: this.nombrelugar,
  		correoLugar: this.correoLugar ,
  		correoTrabajador: this.correoTrabajador 
  	};


  	//this.retirarService.createRetiro(retiro);
  }
}
