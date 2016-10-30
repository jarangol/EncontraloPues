import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';
import { RegistroService} from '../../../providers/registro-service/registro-service';

import { DetalleRetiroPage} from '../detalle-retiro/detalle-retiro';

@Component({ 
   templateUrl: 'build/pages/trabajador/consultar/consultar.html',
   providers: [RegistroService]
})

export class ConsultarPage {
  private registros: any;
  private selectedItem: any;

    //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private nombrePunto: any;
  private codigoBusqueda: any;
  private registro: any;
  private correoTrabajador: any;

  //pertenecen a registro
  private descripcion: string;
  private fecha: any;

  //para dividir la fecha en varios.
  private dia: any;
  private añoMes: any;
  
 
    constructor(private navCtrl: NavController, public registroService: RegistroService, public navParams: NavParams, public retirarService: RetirarService){
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto');
      //this.codigoBusqueda = this.navParams.get('codigoBusqueda');  
      this.registros = this.navParams.get('registros');
      this.correoTrabajador = this.navParams.get('correoTrabajador');
      console.log("En consultar "+this.registros);

  }


   //para ir a ver el detalle
    itemTapped(event, registro) {
     this.navCtrl.push(DetalleRetiroPage, {
      registro: registro,
      correoLugar: this.correoLugar,
      nombrePunto: this.nombrePunto, 
      correoTrabajador: this.correoTrabajador,
            
    });
  }


 }

