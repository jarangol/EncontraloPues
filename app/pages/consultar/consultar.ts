import { Component } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular';
//import {RegistrarPage} from '../../pages/registrar/registrar;
import {Registros} from '../../providers/registros/registros';
/*
  Generated class for the ConsultarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/consultar/consultar.html',
})
export class ConsultarPage {
	registros: any;

  constructor(private navCtrl: NavController, private registroService: Registros, private modalCtrl: ModalController) {

  }
	ionViewLoaded(){
		this.registroService.getRegistros().then((data) => {
            console.log(data);
            this.registros = data;
        });
	}
}
