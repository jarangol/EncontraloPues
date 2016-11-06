import { Component } from '@angular/core';
import { NavController, Alert, NavParams} from 'ionic-angular';
import {TrabajadorPage} from  '../trabajador/trabajador';


//Servicio de llamados http 
import {TrabajadoresService} from '../../../providers/trabajadores-service/trabajadores-service';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajadores/trabajadores.html',
   providers: [TrabajadoresService]
})

export class TrabajadoresPage {
  
  private trabajadores: any; //variable para guardar el listado
  private correoLugar: any; //datos de login

    constructor(private navCtrl: NavController, public navParams: NavParams, public trabajadoresService: TrabajadoresService){
      this.correoLugar = this.navParams.get('correoLugar');
  }

    ionViewLoaded(){
     this.consultarTrabajadores();
    }

    public consultarTrabajadores(){
        this.trabajadoresService.consultarTrabajadores(this.correoLugar)
				.then(data => {
            this.trabajadores = data;
            console.log(this.trabajadores);
        });
					
    }


    public itemTapped(event, trabajador) {
     this.navCtrl.push(TrabajadorPage, {
      trabajador: trabajador,
      correoLugar: this.correoLugar,      
    });
  }


 }
