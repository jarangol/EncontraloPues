import { Component } from '@angular/core';
import { NavController,Page, NavParams} from 'ionic-angular';

//Pagina para mostrar en detalle cada item
import { DetalleRetiroPage} from '../detalle-retiro/detalle-retiro';


@Component({ 
   templateUrl: 'build/pages/trabajador/listar-perdidos/listar-perdidos.html',
})

export class ListarPerdidosPage {
  private anoMes: any

  //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private nombrePunto: any;
  private registros: any;
  private correoTrabajador: any;
 
    constructor(private navCtrl: NavController, public navParams: NavParams){
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto');
      this.registros = this.navParams.get('registros');
      this.correoTrabajador = this.navParams.get('correoTrabajador');
      this.anoMes= this.navParams.get('anoMes');
      

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

