import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, Nav} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';

//Pagina inicial de retirar
import { RetirarPage} from '../../../pages/trabajador/retirar/retirar';

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

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController, public retirarService: RetirarService, public nav:Nav) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
     if(this.registro){  
         //sacamos la fecha de registro
         this.dia = this.registro.lugar.puntosRecoleccion.objetosRetirados.fechaRegistro.dia; 
         this.anoMes = this.registro.lugar.puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes; 
         this.fechaRegistro =this.anoMes + '-' + this.dia ; //para concatenar la fecha que viene separada

         this.codigoBusqueda = this.registro.lugar.puntosRecoleccion.objetosRetirados.codigoBusqueda;
         this.tags = this.registro.lugar.puntosRecoleccion.objetosRetirados.sinCodigoQR.tags;
    	   this.descripcion = this.registro.lugar.puntosRecoleccion.objetosRetirados.sinCodigoQR.descripcionOculta;
         this.puntoRecoleccion =  this.registro.lugar.puntosRecoleccion.nombre;

         //sacamos la fecha de retiro.
         this.dia = this.registro.lugar.puntosRecoleccion.objetosRetirados.retirado.fechaRetiro.dia; 
         this.anoMes = this.registro.lugar.puntosRecoleccion.objetosRetirados.retirado.fechaRetiro.anoMes; 
         this.fechaRetiro = this.anoMes + '-' + this.dia ; //para concatenar la fecha que viene separada

   	     this.nombrePersona = this.registro.lugar.puntosRecoleccion.objetosRetirados.retirado.personaReclamo.nombre;
         this.numeroIdPersona =  this.registro.lugar.puntosRecoleccion.objetosRetirados.retirado.personaReclamo.numeroId;
         this.telefonoPersona =  this.registro.lugar.puntosRecoleccion.objetosRetirados.retirado.personaReclamo.celular;   
    }

  }


}
