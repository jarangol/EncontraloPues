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
private nombrePunto: any; //punto actual
private codigoBusqueda: any;
private registro: any;
private correoTrabajador: any;

//pertenecen a registro
private tags: any;
private descripcion: string;
private fechaRegistro: any;
private actual: any; //me dice si esta en el punto actual para poder retirarlo
private puntoRecoleccion: any; //Lugar  registrado

//para dividir la fecha en varios.
private dia: any;
private anoMes: any; //año y mes concatenados AAAA-MM


  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController,
             public retirarService: RetirarService, public nav:Nav) {
      this.tags=[];
      this.registro = this.navParams.get('registro');
      this.correoLugar = this.navParams.get('correoLugar');
      this.nombrePunto = this.navParams.get('nombrePunto'); 
	    this.correoTrabajador = this.navParams.get('correoTrabajador');
   
     if(this.registro){  
         this.registro = this.registro.puntosRecoleccion;
         this.dia = this.registro.objetosPerdidos.fechaRegistro.dia; 
         this.anoMes = this.registro.objetosPerdidos.fechaRegistro.anoMes; 
         this.fechaRegistro = this.anoMes + '-' + this.dia ; //para concatenar la fecha que viene separada
   	     
         this.codigoBusqueda = this.registro.objetosPerdidos.codigoBusqueda;
         this.tags = this.registro.objetosPerdidos.sinCodigoQR.tags;
    	   this.descripcion = this.registro.objetosPerdidos.sinCodigoQR.descripcionOculta;
         this.actual =  this.registro.actual;
         this.puntoRecoleccion =  this.registro.nombre;
       
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
                    nombrePunto: this.nombrePunto,
                    correoLugar: this.correoLugar ,
                    codigoBusqueda:this.codigoBusqueda,
                    correoTrabajador: this.correoTrabajador 
                  };

                  this.retirarService.createRetiro(retiro)
                  .subscribe(data => {
                      this.registro = data;
                      console.log(this.registro);
                      alert(this.registro.mensaje);
                      if(this.registro.correcto == true){
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
