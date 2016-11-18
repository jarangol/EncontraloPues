import { Component, OnInit } from '@angular/core';
import { NavController, MenuController,Alert, Nav, AlertController} from 'ionic-angular';

import { LogInService } from '../../../providers/logIn-service/logIn-service';
import { PuntosService } from '../../../providers/lugar-service/puntos-service';

import { RegistrarPage} from '../../../pages/trabajador/registrar/registrar';

@Component({
  templateUrl: 'build/pages/trabajador/cuenta/cuenta.html',
  providers: [PuntosService]
})

export class CuentaPage{
    private puntosRecoleccion: any; //listado de puntos disponibles
    private puntoRecoleccion: any; //punto seleccionado

    constructor(public navCtrl: NavController, public loginService: LogInService,
              private alertCtrl: AlertController, public puntoService:PuntosService,
            public nav: Nav, public menuCtrl: MenuController) {}

	ionViewLoaded(){
		this.cargarPuntos();
        this.puntoRecoleccion = this.loginService.getPuntoTrabajador();
	}

	/**
	 * Cargar los puntos de recoleccion para consultar 
	 * Segun si son los objetos perdidos o retirados
	 */
	public cargarPuntos(){
		let correo={
		 correoLugar: this.loginService.getCorreoLugar()
		}

        this.puntoService.consultarPuntos(correo)
        .subscribe(data => {
            if(data.correcto)
                this.puntosRecoleccion = data.mensaje;
            else
                alert(data.mensaje);
            console.log(data);
        });
	}

  public seleccionarPunto(){
      console.log("punto cambiado "+this.puntoRecoleccion);
      this.loginService.setPuntoTrabajador(this.puntoRecoleccion);
      this.nav.setRoot(RegistrarPage);
      this.menuCtrl.enable(true, 'trabajador');
      this.menuCtrl.enable(false, 'lugar');                                
               
    }
}
