import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/lugar/detalle-objeto/detalle-objeto.html',
})
export class DetalleObjetoPage {

//me los pasan como navParams desde la vista retirar

private registro: any;  //objeto en detalle
private correoLugar: any;
private tipoObjetos: any; // (retirados/perdidos)

//pertenecen al registro
private codigoBusqueda: any;
private fecha: any;
private tags: any;
private descripcion: string;
private punto: any;

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController) {
      //iniciamos los tags como vacio
      this.tags=[];

     //recibo datos como parametros
      this.registro = this.navParams.get('registro');
      this.correoLugar = this.navParams.get('correoLugar');
      this.tipoObjetos = this.navParams.get('tipoObjetos');
   
     if(this.registro){  
         this.punto = this.registro.puntosRecoleccion.nombre;
         this.registro=this.registro.puntosRecoleccion.objetosPerdidos;
    	   this.tags = this.registro.tags;
         let dia = this.registro.fechaRegistro.dia; 
         let añoMes = this.registro.fechaRegistro.anoMes; 
         this.fecha = añoMes + '-' + dia ;
    }
  }

  public actualizar(){
    
  }

}
