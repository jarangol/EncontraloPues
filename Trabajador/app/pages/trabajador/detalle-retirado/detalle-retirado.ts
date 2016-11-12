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


//datos de la persona
private nombrePersona: any;
private numeroIdPersona: any;
private telefonoPersona: any;

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController, public retirarService: RetirarService, public nav:Nav) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
     
     if(this.registro){  
         //sacamos la fecha de registro
         this.registro = this.registro.puntosRecoleccion;
         let dia = this.registro.objetosRetirados.fechaRegistro.dia; 
         let anoMes = this.registro.objetosRetirados.fechaRegistro.anoMes; 
         this.fechaRegistro = anoMes + '-' + dia ; //para concatenar la fecha que viene separada
       
         this.codigoBusqueda = this.registro.objetosRetirados.codigoBusqueda;
         this.tags = this.registro.objetosRetirados.sinCodigoQR.tags;
    	   this.descripcion = this.registro.objetosRetirados.sinCodigoQR.descripcionOculta;
         this.puntoRecoleccion =  this.registro.nombre;

         //sacamos la fecha de retiro.
         dia = this.registro.objetosRetirados.retirado.fechaRetiro.dia; 
         anoMes = this.registro.objetosRetirados.retirado.fechaRetiro.anoMes; 
         this.fechaRetiro = anoMes + '-' + dia ; //para concatenar la fecha que viene separada

   	     this.nombrePersona = this.registro.objetosRetirados.retirado.personaReclamo.nombre;
         this.numeroIdPersona =  this.registro.objetosRetirados.retirado.personaReclamo.numeroId;
         this.telefonoPersona =  this.registro.objetosRetirados.retirado.personaReclamo.celular;   
    }

  }


}
