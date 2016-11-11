import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';


//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

// Pagina para navegar
import { DetalleBusquedaPage} from '../detalle-retirado/detalle-retirado';

@Component({ 
   templateUrl: 'build/pages/lugar/resultado-lugar/resultado-lugar.html',
   providers: [LugarService]
})

export class ResultadoLugarPage {
  private registros: any;
  private selectedItem: any;
    //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private nombrePunto: any;
  private registro: any;
  private correoTrabajador: any;


    constructor(private navCtrl: NavController, public lugarService: LugarService, public navParams: NavParams){
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto');
      this.registros = this.navParams.get('registros');
      this.correoTrabajador = this.navParams.get('correoTrabajador');
  }

//hacer dos vistas una para retirado y otra registrado
    itemTapped(event, item) {
     this.navCtrl.push(DetalleBusquedaPage, {
      registro: item,
      correoLugar: this.correoLugar,
      nombrePunto: this.nombrePunto, 
      correoTrabajador: this.correoTrabajador,
            
    });
  }


 }
