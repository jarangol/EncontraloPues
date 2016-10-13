import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//page to push
import { ConfirmarRetiroPage } from '../confirmar-retiro/confirmar-retiro';


@Component({
  templateUrl: 'build/pages/detalle-retiro/detalle-retiro.html',
})
export class DetalleRetiroPage {

private tags:any;
private descripcion: string;
private fecha: any;
private registro: any;
private codigoBusqueda: any;

  constructor(private navCtrl: NavController,public navParams: NavParams) {
  // 	this.registro=navParams.get('registro');
	//	this.codigoObjeto=navParams.get('codigoBusqueda');  	

  // 	this.tags=this.registro.tags; 
  // 	this.descripcion=this.registro.descripcion;
  // 	this.fecha=this.registro.fecha; 
  // }
}

  retirar(){
  	this.navCtrl.push(ConfirmarRetiroPage,{
  		codigoBusqueda: this.codigoBusqueda
  	});
  }
}
