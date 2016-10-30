import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, Nav} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';

//Pagina inicial de retirar
import { RetirarPage} from '../../../pages/trabajador/retirar/retirar';

@Component({
  templateUrl: 'build/pages/trabajador/detalle-retiro/detalle-retiro.html',
})
export class DetalleRetiroPage {

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
private punto: any;

//para dividir la fecha en varios.
private dia: any;
private añoMes: any; //año y mes concatenados AAAA-MM

//private nav: Nav;

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController, public retirarService: RetirarService, public nav:Nav) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto'); 
	    this.correoTrabajador = this.navParams.get('correoTrabajador');
   
     if(this.registro){  
         this.dia = this.registro.lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.dia; 
         this.añoMes = this.registro.lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes; 
         this.fecha =this.añoMes + '-' + this.dia ; //para concatenar la fecha que viene separada
   	     
         this.codigoBusqueda = this.registro.lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda;
         this.tags = this.registro.lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags;
    	   this.descripcion = this.registro.lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta;
         this.punto =  this.registro.lugar.puntosRecoleccion.nombre;
       
    }
  }



      showPrompt() {
        let prompt = this.alertCtrl.create({
          title: 'Retirar',
          message: "Ingrese los datos de quien reclama.",
          inputs: [
            {
              name: 'id',
              placeholder: 'Identificación',
              type: 'text',
            },
             {
              name: 'nombre',
              placeholder: 'Nombre',
              type: 'text'
            },
            {
              name: 'tel',
              placeholder: 'Telefono',
              type: 'tel'
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
                if(data.id && data.tel && data.nombre){
                  let retiro={
                    numeroIdPersona: data.id,
                    nombrePersona: data.nombre,
                    celularPersona: data.tel,

                    correoLugar: this.correoLugar ,
                    codigoBusqueda:this.codigoBusqueda,
                    correoTrabajador: this.correoTrabajador 
                  };

                  this.retirarService.createRetiro(retiro)
                    .then((res) => {
                      this.registro = res;
                      alert(this.registro.mensaje);
                      if(this.registro.correcto){
                        this.nav.setRoot(RetirarPage);
                      }
                    });
                }
              }
            }
          ]
        });
        prompt.present();
  }


  retirar(){
    this.showPrompt();
  }
}
