import { Component } from '@angular/core';
import { NavController,Page, NavParams} from 'ionic-angular';

//Pagina para mostrar en detalle cada item
import { DetalleRetiroPage} from '../detalle-retiro/detalle-retiro';


@Component({ 
   templateUrl: 'build/pages/trabajador/consultar/consultar.html',
})

export class ConsultarPage {

  private selectedItem: any; //item seleccionado de la lista 

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
      console.log("Listar perdidos: "+this.registros);

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

