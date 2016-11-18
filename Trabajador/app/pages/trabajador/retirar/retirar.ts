import { Component } from '@angular/core';
import { NavController,Platform, Alert, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

//page de detalle del retiro
import { DetalleRetiroPage} from '../detalle-retiro/detalle-retiro';

//pagina para resultado de la busqueda
import { ListarPerdidosPage} from '../listar-perdidos/listar-perdidos';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';

//datos de acceso
import { LogInService } from '../../../providers/logIn-service/logIn-service';


@Component({
  templateUrl: 'build/pages/trabajador/retirar/retirar.html',
  providers: [RetirarService],
})


export class RetirarPage {
//Variables de la interfaz
private tags: Array<String>; //arreglo de tags ingresados
private anoMes: any; //fecha del registro (YYYY-MM)
private tipoBusqueda: any; //para guarda la seleccion hecha en el segment

//necesarios para crear de un retiro
private correoLugar: string;
private nombrePunto: string;
private correoTrabajador: string; 

  constructor(public platform: Platform, private navCtrl: NavController,
	public retirarService: RetirarService,public alertCtrl: AlertController, private login:LogInService) {
  	 this.tipoBusqueda = 'fecha';

		 this.tags = [];
		 var hoy = new Date();
		 var mm = hoy.getMonth()+1; //hoy es 0!
		 var yyyy = hoy.getFullYear();
		 this.anoMes = yyyy+'-'+mm;

		 //temporal y desaparece con el login
  	 this.correoLugar = this.login.getCorreoLugar();
     this.nombrePunto = this.login.getPuntoTrabajador();
     this.correoTrabajador= this.login.getCorreoTrabajador(); 
  }


     /**
    * Se llama al iniciar la pagina para refrescar fatos
    */
   ionViewWillEnter() { // se llama todo lo que se quiere que se refreseque en la pag
     this.tipoBusqueda = "fecha";
    }

  public activarQR(){    
  	  this.platform.ready().then(() => {       
				BarcodeScanner.scan().then((barcodeData) => {
		    
		    let prompt = this.alertCtrl.create({
		      title: 'Retirar',
		      message: "Ingrese el código de retiro de este objeto",
		      inputs: [
		        {
		          name: 'codigo',
		          placeholder: 'Código'
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
		          text: 'Confirmar',
		          handler: data => {
		            console.log('data:'+data);

		            let retiro={
									codigoQR: barcodeData.text,
									correoLugar: this.correoLugar ,
									codigoRetiro: data,
									nombrePunto: this.nombrePunto,
									correoTrabajador: this.correoTrabajador 
			    			};

									 
		            this.retirarService.createRetiroQR(retiro)
								.then(data => {
										if(data.correcto){
											prompt.dismiss().then(() => {
												alert(data.mensaje);
											}); 
										}else{
											prompt.setMessage(data.mensaje);
										}
            				console.log(data.mensaje);
										
       					 });		
		          }
		        }
		      ]
		    });
		    prompt.present();
		
			}, (err) => {
				alert("Ha ocurrido un error: "+err);
			}); 
				});
  }

  public buscar(){
		console.log(this.tipoBusqueda);
		if(this.anoMes){
  		let consulta = {
  			anoMesRegistro : this.anoMes,
  			tags: this.tags,
  			correoLugar: this.correoLugar,
  			nombrePunto: this.nombrePunto,
  		}

			this.retirarService.consultarPerdidosFecha(consulta)
		  .subscribe(data => {
            console.log(data);		
						if(data.correcto){
							this.navCtrl.push(ListarPerdidosPage,{ 	 					
								correoLugar: this.correoLugar,
								nombrePunto: this.nombrePunto,
								registros: data.mensaje,
								correoTrabajador: this.correoTrabajador,
								anoMes: this.anoMes
							});
						}else{
							alert(data.mensaje);
						}
      });
		}	
	}
	
   /**
    * Busca un objeto perdido por su consecutivo
    */
   public buscarConsecutivo() {
    let prompt = this.alertCtrl.create({
      title: 'Buscar consecutivo',
      message: "Ingrese el consecutivo completo del objeto perdido.",
      inputs: [
        {
          name: 'consecutivo',
          placeholder: 'Consecutivo',
					type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          //this.tipoBusqueda = "fecha";

          }
        },
        {
          text: 'Buscar',
          handler: data => {
            let consulta = {
							codigoBusqueda: data.consecutivo,
							correoLugar: this.correoLugar,
							nombrePunto: this.nombrePunto,
						}
						// console.log(data.consecutivo);
						// console.log(this.correoLugar);
						// console.log(this.nombrePunto);
						this.retirarService.consultarPerdidosCodigo(consulta)
						.subscribe(data => {
								if(data.correcto){										
										prompt.dismiss().then(() => {
                  		 this.navCtrl.push(DetalleRetiroPage,{ 	 					
												 correoLugar: this.correoLugar,
												 nombrePunto: this.nombrePunto,
										 		 registro: data.mensaje, 
												 correoTrabajador: this.correoTrabajador
												}); 
										
                		}); 
								}else{
									alert(data.mensaje);
								}
						});
						return false;
          }
        }
      ]
    });
    prompt.present();
  }


  public addTag(tagNameInput: any): void {
    if(tagNameInput.value) {
      this.tags.push(tagNameInput.value);
      tagNameInput.value = '';
    }
  }
  
  public deleteTag(tagName: string) {
    let index = this.tags.indexOf(tagName);  
    this.tags.splice(index, 1);
  } 


}
