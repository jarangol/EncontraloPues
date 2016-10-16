import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//page to push
import { ConfirmarRetiroPage } from '../confirmar-retiro/confirmar-retiro';


@Component({
  templateUrl: 'build/pages/detalle-retiro/detalle-retiro.html',
})
export class DetalleRetiroPage {

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

  constructor(private navCtrl: NavController,public navParams: NavParams) {
  // 	this.registro=navParams.get('registro');
	//	this.codigoBusqueda=navParams.get('codigoBusqueda');  	

  // 	this.tags=this.registro.tags; 
  // 	this.descripcion=this.registro.descripcion;
  // 	this.fecha=this.registro.fecha; 
  // }
}

  retirar(){
  	this.navCtrl.push(ConfirmarRetiroPage,{           
      //    correoLugar: this.correoLugar,
      //    nombrePunto: this.nombrePunto,
      //    correoTrabajador: this.correoTrabajador
            //    codigoBusqueda: this.codigoBusqueda,

  	});
  }
}
