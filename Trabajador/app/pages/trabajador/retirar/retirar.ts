import { Component } from '@angular/core';
import { NavController,Platform, Alert, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

//page de detalle del retiro
import { DetalleRetiroPage} from '../detalle-retiro/detalle-retiro';

//pagina para resultado de la busqueda
import { ConsultarPage} from '../consultar/consultar';

//proveedor del service
import { RetirarService } from '../../../providers/retirar-service/retirar-service';

@Component({
  templateUrl: 'build/pages/trabajador/retirar/retirar.html',
  providers: [RetirarService],
})


export class RetirarPage {
//Variables de la interfaz
private tags: Array<String>; //arreglo de tags ingresados
private fecha: any; //fecha del registro (YYYY-MM)
private tipoBusqueda: any; //para guarda la seleccion hecha en el segment

//necesarios para crear de un retiro
private correoLugar: string;
private nombrePunto: string;
private nombreLugar: string;
private correoTrabajador: string; 

  constructor(public platform: Platform, private navCtrl: NavController,public retirarService: RetirarService,public alertCtrl: AlertController) {
  	 this.tipoBusqueda = 'fecha';

		 this.tags = [];
		 var hoy = new Date();
		 var mm = hoy.getMonth()+1; //hoy es 0!
		 var yyyy = hoy.getFullYear();
		 this.fecha = yyyy+'-'+mm;

		 //temporal y desaparece con el login
  	 this.correoLugar="Eafit@";
     this.nombrePunto="b";
     this.correoTrabajador="m";
     this.nombreLugar="d";

		 
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
				this.tipoBusqueda = 'fecha';
			}); 
				});
  }

  public buscar(){
		if(this.tipoBusqueda=='fecha' && this.fecha ){
  		let consulta = {
  			anoMesRegistro : this.fecha,
  			tags: this.tags,
  			correoLugar: this.correoLugar,
  			nombrePunto: this.nombrePunto,
  		}

			this.retirarService.consultarPerdidosFecha(consulta)
		  .subscribe(data => {
            console.log(data);		
						if(data.correcto){
							this.navCtrl.push(ConsultarPage,{ 	 					
								correoLugar: this.correoLugar,
								nombrePunto: this.nombrePunto,
								registros: data.mensaje,
								correoTrabajador: this.correoTrabajador
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
		this.tipoBusqueda = 'fecha';
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
            console.log('Cancel clicked');

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
