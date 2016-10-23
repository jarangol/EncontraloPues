import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';


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
      this.codigoBusqueda = this.navParams.get('codigoBusqueda');
	    this.correoTrabajador = this.navParams.get('correoTrabajador');

   
     if(this.registro){  
         this.tags = this.registro.objetosPerdidos.sinCodigoQR.tags;
    	   this.descripcion = this.registro.objetosPerdidos.sinCodigoQR.descripcionOculta;
    	  
         this.dia = this.registro.objetosPerdidos.fechaRegistro.dia; 
         this.fecha =this.añoMes + '-' + this.dia ;
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
                  console.log(data.id);
                  console.log(data.nombre);
                  console.log(data.tel);
                  console.log(typeof data.id);
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
                      alert(res);
                      this.registro = res;
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
