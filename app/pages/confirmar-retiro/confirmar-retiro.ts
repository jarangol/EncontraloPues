import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';


@Component({
  templateUrl: 'build/pages/confirmar-retiro/confirmar-retiro.html',
})

export class ConfirmarRetiroPage {
private codigoBusqueda: any; 
private id: any;
private nombre: any;
private telefono: any;

  constructor(private navCtrl: NavController,public navParams: NavParams,public retirarService: RetirarService) {
  	this.codigoBusqueda=navParams.get('codigoBusqueda');
  }

  confirmar(){
  	//this.retirarService.createRegistro(codigo,id,nombre,telefono,nombrelugar,correoLugar,correoTrabajador);
  }
}
