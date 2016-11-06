import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, Nav} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/trabajador/detalle-retirado/detalle-retirado.html',
})


export class DetalleRetiradoPage {

private registro: any;//contiene la informacion para mostrar

//pertenecen a registro
private fechaRegistro: any;
private fechaRetiro: any;
private codigoBusqueda: any;
private tags: any;
private descripcion: string;
private puntoRecoleccion: any;

//para dividir la fecha en varios.
private dia: any;
private anoMes: any; //año y mes concatenados AAAA-MM

//datos de la persona
private nombrePersona: any;
private numeroIdPersona: any;
private telefonoPersona: any;

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController, public nav:Nav) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
     
     if(this.registro){  
         //sacamos la fecha de registro
         this.registro = this.registro.puntosRecoleccion;
         this.dia = this.registro.objetosRetirados.fechaRegistro.dia; 
         this.anoMes = this.registro.objetosRetirados.fechaRegistro.anoMes; 
         this.fechaRegistro = this.anoMes + '-' + this.dia ; //para concatenar la fecha que viene separada
       
         this.codigoBusqueda = this.registro.objetosRetirados.codigoBusqueda;
         this.tags = this.registro.objetosRetirados.sinCodigoQR.tags;
    	   this.descripcion = this.registro.objetosRetirados.sinCodigoQR.descripcionOculta;
         this.puntoRecoleccion =  this.registro.nombre;

         //sacamos la fecha de retiro.
         this.dia = this.registro.objetosRetirados.retirado.fechaRetiro.dia; 
         this.anoMes = this.registro.objetosRetirados.retirado.fechaRetiro.anoMes; 
         this.fechaRetiro = this.anoMes + '-' + this.dia ; //para concatenar la fecha que viene separada

   	     this.nombrePersona = this.registro.objetosRetirados.retirado.personaReclamo.nombre;
         this.numeroIdPersona =  this.registro.objetosRetirados.retirado.personaReclamo.numeroId;
         this.telefonoPersona =  this.registro.objetosRetirados.retirado.personaReclamo.celular;   
    }

  }


}
