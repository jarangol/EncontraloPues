import { Component } from '@angular/core';
import { NavController, Alert, NavParams} from 'ionic-angular';
import {TrabajadorPage} from  '../trabajador/trabajador';


//Servicio de llamados http 
import {TrabajadoresService} from '../../../providers/trabajadores-service/trabajadores-service';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajadores/trabajadores.html',
})

export class TrabajadoresPage {
  
  private trabajadores: any; //variable para guardar el listado
  private correoLugar: any; //datos de login

    constructor(private navCtrl: NavController, public navParams: NavParams){
      this.correoLugar = this.navParams.get('correoLugar');
  }


    public consultarTrabajadores(){
        //llamar al provider
    }


    public itemTapped(event, trabajador) {
     this.navCtrl.push(TrabajadorPage, {
      trabajador: trabajador,
      correoLugar: this.correoLugar,      
    });
  }


 }
