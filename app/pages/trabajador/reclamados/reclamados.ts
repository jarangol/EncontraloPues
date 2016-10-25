import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { RetiradosService} from '../../providers/retirados-service/retirados-service';

@Component({
  templateUrl: 'build/pages/reclamados/reclamados.html',
    providers: [RetiradosService],
})
export class ReclamadosPage {
private objetos: any;

  constructor(private navCtrl: NavController, private retiradosService: RetiradosService) {
  	
  }

  public getObjetos(){
  	 this.retiradosService.consultarRetiradosTrabajador()
      .then(data => {
        this.objetos = data;
      });
  }

  public ionViewLoaded(){
   // this.getObjetos();
  }
}
