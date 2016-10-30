import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert, AlertController,NavParams} from 'ionic-angular';
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
private qrCode: string; //codigo escaneado
private tags: any; //arreglo de tags ingresados
private fecha: any; //fecha del registro (YYYY-MM)
private tipoBusqueda: any; //para guarda la seleccion hecha en el segment


public registros: any; //para guardar lo que devuelve  la consulta 

//necesarios para el insert de un retiro
private correoLugar: string;
private nombrePunto: string;
private nombreLugar: string;
private codigoBusqueda: any; //ingresado por el usuario
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

  public scan(): string {
        this.platform.ready().then(() => {       
			   BarcodeScanner.scan().then((barcodeData) => {
				 alert("scan");
         		alert(barcodeData.text);
         return barcodeData.text;
			}, (err) => {
			    alert("Ha ocurrido un error: "+err);
			}); 
        });
        return "";
    }

  public activarQR(){    
  	  this.platform.ready().then(() => {       
				BarcodeScanner.scan().then((barcodeData) => {
				this.qrCode=barcodeData.text;
		    
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
									codigoQR: this.qrCode,
									correoLugar: this.correoLugar ,
									codigoRetiro: data,
									nombrePunto: this.nombrePunto,
									correoTrabajador: this.correoTrabajador 
			    		};

		            this.retirarService.createRetiroQR(retiro)
								.then((data) => {
										this.registros = data;
										console.log(data);
										alert(data);
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
		if(this.tipoBusqueda=='fecha' && this.fecha ){
  		var consulta = {
  			añoMesRegistro : this.fecha,
  			tags: this.tags,
  			correoLugar: this.correoLugar,
  			nombrePunto: this.nombrePunto,
  		}

			this.retirarService.consultarPerdidosFecha(consulta)
			.then((data) => {
      	console.log(data);
			 this.registros=data;
			
				this.navCtrl.push(ConsultarPage,{ 	 					
					correoLugar: this.correoLugar,
					nombrePunto: this.nombrePunto,
					registros: data.mensaje, //pasarle especificamente el atributo sin el mensaje
					correoTrabajador: this.correoTrabajador
				});
		
			});
		}else if(this.tipoBusqueda=='codigo' && this.codigoBusqueda){
				let consulta = {
					codigoBusqueda: this.codigoBusqueda,
					correoLugar: this.correoLugar,
					nombrePunto: this.nombrePunto,
  			}
				this.retirarService.consultarPerdidosCodigo(consulta)
				.then((data) => {

      		console.log(data);
					this.registros=data;
					
					if(this.registros.correcto){
							this.navCtrl.push(ConsultarPage,{ 	 					
								correoLugar: this.correoLugar,
								nombrePunto: this.nombrePunto,
								registros: data.mensaje, //pasarle especificamente el atributo sin el mensaje
								correoTrabajador: this.correoTrabajador
							});
					}
				});
		}
			this.codigoBusqueda = "";
		
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
