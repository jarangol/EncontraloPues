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
  private url: string;

  constructor(private navCtrl: NavController, public qrService: GenerarQRService) {
    this.url = "https://afternoon-crag-97293.herokuapp.com/qr/";
  }

  generar(){
    if(this.texto){
      this.url = "https://afternoon-crag-97293.herokuapp.com/qr/"+this.texto;
    }
  }

}
