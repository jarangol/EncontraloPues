import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

// Pagina para navegar al detalle del objeto segun su tipo
import { ObjetoPerdidoPage} from '../objeto-perdido/objeto-perdido';
import { ObjetoRetiradoPage} from '../objeto-retirado/objeto-retirado';




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

    itemTapped(event, registro) {
      if(this.tipoObjetos == 'perdidos')
        this.navCtrl.push(ObjetoPerdidoPage, {
          registro: registro,
          correoLugar: this.correoLugar,
        });
      else if(this.tipoObjetos == 'retirados')
        this.navCtrl.push(ObjetoRetiradoPage, {
          registro: registro,
        });
     }


 }
