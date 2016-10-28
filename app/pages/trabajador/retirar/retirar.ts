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
tab1Root = ConsultarPage;
tab2Root = DetalleRetiroPage;


private qrToggle: any; //variable de la interfaz para activarQR
private qrCode: string; //codigo escaneado
private tags: any;
private fecha: any; //fecha del registro (YYYY-MM)

public registros: any; //devuelve de la consulta por codigo de búsqueda

//necesarios para el insert de un retiro
private correoLugar: string;
private nombrePunto: string;
private nombreLugar: string;
private codigoBusqueda: any; //ingresado por el usuario
private correoTrabajador: string; 

  constructor(public platform: Platform, private navCtrl: NavController,public retirarService: RetirarService,public alertCtrl: AlertController) {
  	 this.tags = [];

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

  public activarQR():void{    
    
    if(this.qrToggle){
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

  }

  public buscar(){
		if(this.fecha){
  		let consulta = {
  			añoMesRegistro : this.fecha,
  			codigoBusqueda: this.codigoBusqueda,
  			tags: this.tags,
  			correoLugar: this.correoLugar,
  			nombrePunto: this.nombrePunto,
  		}
  		 
			let registros2: any;

			this.retirarService.consultarPerdidosTrabajador(consulta)
			.then((data) => {
      	console.log(data);
      	this.navCtrl.push(ConsultarPage,{ 	 					
					correoLugar: this.correoLugar,
					nombrePunto: this.nombrePunto,
					codigoBusqueda: this.codigoBusqueda,
					registros: data, //.lugar.puntosRecoleccion,
					correoTrabajador: this.correoTrabajador
				});
			});
			console.log("En page: "+registros2);

			

			this.codigoBusqueda = "";
		}	
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
