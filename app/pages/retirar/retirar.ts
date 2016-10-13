import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

//page de detalle del retiro
import { DetalleRetiroPage} from '../../pages/detalle-retiro/detalle-retiro';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';

@Component({
  templateUrl: 'build/pages/retirar/retirar.html',
})
export class RetirarPage {
private qrToggle: any;
private qrCode: string;
private codigoBusqueda: string;
private registro: any;

  constructor(public platform: Platform, private navCtrl: NavController,public retirarService: RetirarService,public alertCtrl: AlertController) {

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
	  	this.retirarService.consultarCodigo(this.codigoBusqueda)
	  	.then((data) => {
      		console.log(data);
      		this.registro = data;
    	});
 
	  	this.navCtrl.push(DetalleRetiroPage,{
	  	 	registro: this.registro,
	  	 	codigoBusqueda: this.codigoBusqueda
	  	});
	  }

  }

}
