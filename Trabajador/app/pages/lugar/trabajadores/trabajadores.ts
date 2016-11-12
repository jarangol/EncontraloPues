import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

@Component({ 
   templateUrl: 'build/pages/lugar/resultado-lugar/resultado-lugar.html',
   providers: [LugarService]
})

export class TrabajadoresPage {
    private trabajadores: any; //resultado de la consulta
    constructor(private navCtrl: NavController, public lugarService: LugarService){

    }


    ionViewLoaded(){
        this.cargarTrabajadores;
    }

    public cargarTrabajadores(){
        this.lugarService.
    }

    itemTapped(event, trabajador) {

    }
}
