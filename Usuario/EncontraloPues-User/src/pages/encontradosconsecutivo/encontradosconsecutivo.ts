import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Encontradosconsecutivo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-encontradosconsecutivo',
  templateUrl: 'encontradosconsecutivo.html'
})
export class Encontradosconsecutivo {

 private consulta: any;
 
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.consulta = this.navParams.get('consulta');
  }

  ionViewDidLoad() {
    console.log('Hello Encontradosconsecutivo Page');
  }

}
