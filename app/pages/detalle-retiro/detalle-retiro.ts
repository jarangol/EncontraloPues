import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//page to push
import { ConfirmarRetiroPage } from '../confirmar-retiro/confirmar-retiro';


@Component({
  templateUrl: 'build/pages/detalle-retiro/detalle-retiro.html',
})
export class DetalleRetiroPage {

//me los pasan como navParams desde la vista retirar
private correoLugar: any;
private nombrePunto: any;
private codigoBusqueda: any;
private registro: any;
private correoTrabajador: any;

//pertenecen a registro
tags: any;
private descripcion: string;
private fecha: any;

//para dividir la fecha en varios.
private dia: any;
private mes: any;
private año: any;

  constructor(private navCtrl: NavController,public navParams: NavParams) {
      this.tags=[];
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto');
      this.codigoBusqueda = this.navParams.get('codigoBusqueda');  
      this.registro = this.navParams.get('registro');
	    this.correoTrabajador = this.navParams.get('correoTrabajador');

   
//     if(this.registro){  
         console.log(this.registro.objetosPerdidos.sinCodigoQR.tags);
         console.log(typeof this.registro.objetosPerdidos.fechaRegistro);
      	
         this.tags = this.registro.objetosPerdidos.sinCodigoQR.tags; 
    	   this.descripcion = this.registro.objetosPerdidos.sinCodigoQR.descripcionOculta;
    	  
         this.dia = this.registro.objetosPerdidos.fechaRegistro.dia; 
         this.mes = this.registro.objetosPerdidos.fechaRegistro.mes; 
         this.año = this.registro.objetosPerdidos.fechaRegistro.año; 
        
         this.fecha = this.dia + '/' + this.mes + '/' + this.año;
  //  }
  }

  retirar(){
  	this.navCtrl.push(ConfirmarRetiroPage,{           
         correoLugar: this.correoLugar,
         nombrePunto: this.nombrePunto,
         correoTrabajador: this.correoTrabajador,
         codigoBusqueda: this.codigoBusqueda,
  	});
  }
}
