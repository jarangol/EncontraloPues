import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Pagina para mostrar en detalle cada item
import { DetalleRetiradoPage} from '../detalle-retirado/detalle-retirado';


@Component({
  templateUrl: 'build/pages/listar-retirados/listar-retirados.html',
})

export class ListarRetiradosPage {

  private selectedItem: any; //item seleccionado de la lista



  //me los pasan como navParams desde la vista retirados
  private correoLugar: any;
  private nombrePunto: any;
  private registros: any; //para guardar resultado de la consulta
  private correoTrabajador: any;
  private fecha: any;

  constructor(private navCtrl: NavController, public navParams: NavParams) {
      this.registros = this.navParams.get('registros');
      this.fecha = this.navParams.get('fecha');
      console.log("listar retirados: "+this.registros);
  }
  
  //para ir a ver el detalle
  itemTapped(event, registro) {
     this.navCtrl.push(DetalleRetiradoPage, {
        registro: registro,
        correoLugar: this.correoLugar,
        nombrePunto: this.nombrePunto,             
      });
   }

}
