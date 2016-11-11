import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';


@Component({
  templateUrl: 'build/pages/lugar/detalle-busqueda/detalle-busqueda.html',
})
export class DetalleBusquedaPage {

//me los pasan como navParams desde la vista retirar
private correoLugar: any;
private nombrePunto: any;
private codigoBusqueda: any;
private registro: any;
private correoTrabajador: any;

//pertenecen a registro
private tags: any;
private descripcion: string;
private fecha: any;

//para dividir la fecha en varios.
private dia: any;
private añoMes: any; //año y mes concatenados AAAA-MM

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController, public retirarService: RetirarService) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto'); 
	    this.correoTrabajador = this.navParams.get('correoTrabajador');

   
     if(this.registro){  
        this.registro=this.registro.puntosRecoleccion.objetosPerdidos;
         this.tags = this.registro.tags;
    	   this.descripcion = this.registro.sinCodigoQR.descripcionOculta;
    	  
         this.dia = this.registro.fechaRegistro.dia; 
         this.añoMes = this.registro.fechaRegistro.anoMes; 
         this.fecha =this.añoMes + '-' + this.dia ;
    }
  }

  public actualizar(){
    
  }

}
