import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Service para los llamados http
import { RetiradosService} from '../../../providers/retirados-service/retirados-service';

@Component({
  templateUrl: 'build/pages/trabajador/reclamados/reclamados.html',
    providers: [RetiradosService],
})
export class ReclamadosPage {
  private objetos: any;

  //campos para la consulta
  private nombrePunto: any;

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
