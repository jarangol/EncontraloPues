import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajador/trabajador.html',
})

export class TrabajadorPage {
  
  private trabajador: any; 
  private correoLugar: any; //datos de login
  
    constructor(private navCtrl: NavController, public navParams: NavParams){
      this.correoLugar = this.navParams.get('correoLugar');
  }


    itemTapped(event, trabajador) {
    //  this.navCtrl.push(TrabajadorPage, {
    //   trabajador: trabajador,
    //   correoLugar: this.correoLugar,      
    // });
  }

  public actualizar(){
      //llamar al provider
  }

 }