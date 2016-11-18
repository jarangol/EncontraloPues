import { Component, OnInit } from '@angular/core';
import { NavController, MenuController,Alert, Nav, AlertController, Select } from 'ionic-angular';
import { LogInService } from '../../providers/logIn-service/logIn-service';
import { PuntosService } from '../../providers/lugar-service/puntos-service';

//paginas para navegar segun usuario
import { CuentaPage } from '../../pages/trabajador/cuenta/cuenta';
import {BuscarLugarPage} from '../../pages/lugar/buscar-lugar/buscar-lugar';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [PuntosService]
})

export class Login {

  private correo: any;
  private contrasena: any;

  constructor(public navCtrl: NavController, public loginService: LogInService,
              public menuCtrl: MenuController, public nav: Nav,
              private alertCtrl: AlertController, public puntoService:PuntosService) {
              
                this.menuCtrl.enable(false, 'trabajador');
                this.menuCtrl.enable(false, 'lugar');
              }

  /**
   * Verifica si los datos de acceso son correctos y el el tipo de usuario
   */
  public validar() {
    if (this.correo && this.contrasena) {
      let validacion = {
        correoElectronico: this.correo,
        contrasena: this.contrasena
      };
      console.log(this.correo);
      this.contrasena = "";
      
      this.loginService.validarInfo(validacion)
      .subscribe((res) => {
          if(res.correcto){
              this.loginService.setCorreoLugar(res.mensaje._id);
              if(res.mensaje.lugar){
                this.menuCtrl.enable(false, 'trabajador');
                this.menuCtrl.enable(true, 'lugar');
                this.nav.setRoot(BuscarLugarPage);
              }else{
                this.nav.setRoot(CuentaPage);           
                this.loginService.setCorreoTrabajador(res.mensaje.trabajadores._id);
              }  
         }else{
           alert(res.mensaje);
         }
        });
    }
  }





  public seleccionarPunto() {
  

  
  let alert = this.alertCtrl.create({
    title: 'Punto de Recolección',
    message: 'Seleccione el punto en el cual se encuentra.',
    inputs: [
      {
        
      } 
    ],
    buttons: [
      {
        text: 'Seleccionar',
        handler: data => {
          console.log(data.text);
        }
      }
    ]
  });
  let correoLugar = {
   correoLugar: this.loginService.getCorreoLugar()
  }
  this.puntoService.consultarPuntos(correoLugar).subscribe(data => {
    if(data.correcto){
      for(let punto of data.mensaje){
        console.log(punto.puntosRecoleccion.nombre);
        let input = {
          type: "radio",
          name: punto.puntosRecoleccion.nombre,
          label: punto.puntosRecoleccion.nombre,
        }
        alert.addInput(input);
      }
    
    }
  });  


   
  alert.present();
}




}
