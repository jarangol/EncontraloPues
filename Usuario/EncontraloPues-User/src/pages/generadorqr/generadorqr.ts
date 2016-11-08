import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Generarqr } from '../../providers/generarqr/generarqr';

/*
  Generated class for the Generadorqr page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-generadorqr',
  templateUrl: 'generadorqr.html',
  providers: [Generarqr]
})

export class Generadorqr {
   texto: any;
   data: any;
   url: string;

  constructor(public navCtrl: NavController,public qrGenerador: Generarqr ) {}

  ionViewDidLoad() {
    console.log('Hello Generadorqr Page');
  }

  generar(){
    if(this.texto){
      this.url = "https://afternoon-crag-97293.herokuapp.com/qr/"+this.texto;
    }
  }

}
