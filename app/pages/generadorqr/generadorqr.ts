import { Component,  OnInit } from '@angular/core';
import { NavController} from 'ionic-angular';

//proveedor del service de qr
import { GenerarQRService} from '../../providers/generarQR/generarQR';
/*
  Generated class for the GeneradorqrPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({

  templateUrl: 'build/pages/generadorqr/generadorqr.html',
    providers: [GenerarQRService],
})



export class GeneradorqrPage {

private texto: any;
private data: any;

	constructor(private navCtrl: NavController, public qrService: GenerarQRService) {
  
  	}	

  	generar(){
  		if(this.texto){
	  		this.qrService.generar(this.texto)
		  	.then((data) => {
	      		this.data = data;
	   		 });
		}
  	}

}
