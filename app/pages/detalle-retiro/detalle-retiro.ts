import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfirmarRetiroPage } from '../confirmar-retiro/confirmar-retiro';


@Component({
  templateUrl: 'build/pages/detalle-retiro/detalle-retiro.html',
})
export class DetalleRetiroPage {

  constructor(private navCtrl: NavController) {

  }

  retirar(){
  	this.navCtrl.push(ConfirmarRetiroPage);
  }
}
