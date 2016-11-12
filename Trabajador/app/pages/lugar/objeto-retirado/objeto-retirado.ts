import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/lugar/objeto-retirado/objeto-retirado.html',
})
export class ObjetoRetiradoPage {

  //me los pasan como navParams desde la vista retirar
  private registro: any;  //objeto en detalle
  private qr: boolean; //me dice si el objeto es con qr 

  //pertenecen al registro
  private codigoBusqueda: any;
  private fechaRegistro: any;
  private tags: any;
  private descripcionOculta: string;
  private puntoRecoleccion: any;
  private personaReclamo: any; //persona que retiro el objeto


//pertenecen al retiro
private fechaRetiro: any;

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController) {
      //iniciamos los tags como vacio
      this.tags=[];

     //recibo datos como parametros
      this.registro = this.navParams.get('registro');

     if(this.registro){  
      
         this.puntoRecoleccion = this.registro.puntosRecoleccion.nombre;
   
         this.registro = this.registro.puntosRecoleccion.objetosRetirados; //para acortar la ruta
       
         if(this.registro.sinCodigoQR){
           this.descripcionOculta = this.registro.sinCodigoQR.descripcionOculta;
           this.qr=false;
         }else this.qr=true;
         
         console.log("qr "+this.qr);
         
         this.tags = this.registro.tags;

         let dia = this.registro.fechaRegistro.dia; 
         let anoMes = this.registro.fechaRegistro.anoMes; 
         this.fechaRegistro = anoMes + '-' + dia ;

         //fecha de retiro
         dia = this.registro.retirado.fechaRetiro.dia;
         anoMes = this.registro.retirado.fechaRetiro.anoMes;
         this.fechaRetiro = anoMes + '-' + dia;

         this.personaReclamo = this.registro.retirado.personaReclamo;
    }
  }


}
