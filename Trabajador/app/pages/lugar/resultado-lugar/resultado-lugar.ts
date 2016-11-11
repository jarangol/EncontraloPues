import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';


//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

// Pagina para navegar
import { DetalleObjetoPage} from '../detalle-objeto/detalle-objeto';

@Component({ 
   templateUrl: 'build/pages/lugar/resultado-lugar/resultado-lugar.html',
   providers: [LugarService]
})

export class ResultadoLugarPage {

  
  //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private anoMes: any; //año, mes con que se filtra la busqueda
  private registros: any; //resultado d ela busqueda
  private tipoObjetos: any;

    constructor(private navCtrl: NavController, public lugarService: LugarService, public navParams: NavParams){
      this.correoLugar = this.navParams.get('correoLugar');
      this.anoMes= this.navParams.get('anoMes');
      this.registros = this.navParams.get('registros');
      this.tipoObjetos = this.navParams.get('tipoObjetos');
    }

    itemTapped(event, item) {
     this.navCtrl.push(DetalleObjetoPage, {
        registro: item,
        correoLugar: this.correoLugar,
        tipoObjetos: this.tipoObjetos
      });
  }


 }
