import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Encontrados page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-encontrados',
  templateUrl: 'encontrados.html'
})

export class Encontrados {
  private anoMes: any; //año, mes con que se filtra la busqueda
  private consulta: any;
  private punto: any;

  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.consulta = this.navParams.get('consulta');
    this.punto = this.navParams.get('lugar'); 
  }

  ionViewDidLoad() {
    console.log('Hello Encontrados Page');
  }

}
