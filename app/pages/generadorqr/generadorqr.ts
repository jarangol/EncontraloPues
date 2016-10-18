import { Component,  OnInit } from '@angular/core';
import { NavController} from 'ionic-angular';

//proveedor del service de qr
import { GenerarQRService} from '../../providers/generarQR/generarQR';


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
