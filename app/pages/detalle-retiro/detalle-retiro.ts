import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';

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

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController) {
      this.tags=[];
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto'); 
      this.registro = this.navParams.get('registro');
	    this.correoTrabajador = this.navParams.get('correoTrabajador');

   
     if(this.registro){  

      	
         this.tags = this.registro.objetosPerdidos.sinCodigoQR.tags; 
    	   this.descripcion = this.registro.objetosPerdidos.sinCodigoQR.descripcionOculta;
    	  
         this.dia = this.registro.objetosPerdidos.fechaRegistro.dia; 
         this.mes = this.registro.objetosPerdidos.fechaRegistro.mes; 
         this.año = this.registro.objetosPerdidos.fechaRegistro.año; 
        
         this.fecha = this.dia + '/' + this.mes + '/' + this.año;
    }
  }



      showPrompt() {
        let prompt = this.alertCtrl.create({
          title: 'Retirar',
          message: "Ingrese los datos de quien reclama.",
          inputs: [
            {
              name: 'id',
              placeholder: 'Identificación'
            },
             {
              name: 'nombre',
              placeholder: 'Nombre'
            },
            {
              name: 'tel',
              placeholder: 'Telefono'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Retirar',
              handler: data => {
                console.log('Saved clicked');
              }
            }
          ]
        });
        prompt.present();
  }


  retirar(){
    this.showPrompt();
  	// this.navCtrl.push(ConfirmarRetiroPage,{           
   //       correoLugar: this.correoLugar,
   //       nombrePunto: this.nombrePunto,
   //       correoTrabajador: this.correoTrabajador,
   //       codigoBusqueda: this.codigoBusqueda,
  	// });
  }
}
