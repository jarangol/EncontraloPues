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
  }

  confirmar(){
  	//this.retirarService.createRegistro(codigoBusqueda,id,nombre,telefono,nombrelugar,correoLugar,correoTrabajador);
  }
}