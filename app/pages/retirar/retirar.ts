import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

//page de detalle del retiro
import { DetalleRetiroPage} from '../../pages/detalle-retiro/detalle-retiro';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';

@Component({
  templateUrl: 'build/pages/retirar/retirar.html',
  providers: [RetirarService],
})


export class RetirarPage {

private qrToggle: any; //variable de la interfaz 
private qrCode: string; //codigo escaneado

private registro: any; //devuelve de la consulta por codigo de búsqueda

//necesarios para el insert de un retiro
private correoLugar: string;
private nombrePunto: string;
private nombreLugar: string;
private codigoBusqueda: any; //ingresado por el usuario
private correoTrabajador: string; 
private data1: any;

  constructor(public platform: Platform, private navCtrl: NavController,public retirarService: RetirarService,public alertCtrl: AlertController) {
  	 this.correoLugar="Eafit@";

     this.nombrePunto="c";
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
			alert("scan");
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
  	if(this.codigoBusqueda){
  		let consulta = {
  			codigoBusqueda: this.codigoBusqueda,
  			correoLugar: this.correoLugar,
  			nombrePunto: this.nombrePunto
  		}
	  	this.retirarService.consultarCodigo(consulta)
	  	.then((data) => {
      		this.registro = data;
      		console.log("Resultado "+ this.registro);
      		
      		this.data1=JSON.parse(data);
      		console.log("parseado "+ this.data1[0].nombre);
   		 });

	  	this.navCtrl.push(DetalleRetiroPage,{ 	 	
	  	 	// correoLugar: this.correoLugar,
	  	 	// nombrePunto: this.nombrePunto,
	  	 	// codigoBusqueda: this.codigoBusqueda,
	  	 	// registro: this.registro,
	  	 	// correoTrabajador: this.correoTrabajador

	  	});
	  	  	this.codigoBusqueda="";
	  }

  }

}
