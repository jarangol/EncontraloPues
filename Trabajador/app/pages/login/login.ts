import { Component, OnInit } from '@angular/core';
import { NavController, MenuController,Alert, Nav } from 'ionic-angular';
import { LogInService } from '../../providers/logIn-service/logIn-service';

//paginas para navegar segun usuario
import { RegistrarPage} from '../../pages/trabajador/registrar/registrar';
import {BuscarLugarPage} from '../../pages/lugar/buscar-lugar/buscar-lugar';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  //providers: [LogInService]
})

export class Login {

  private correo: any;
  private contrasena: any;


  constructor(public navCtrl: NavController, public loginService: LogInService,
              public menuCtrl: MenuController, public nav: Nav) {
                this.menuCtrl.enable(false, 'trabajador');
                this.menuCtrl.enable(false, 'lugar');
               }

  public validar() {
    if (this.correo && this.contrasena) {
      let validacion = {
        correoElectronico: this.correo,
        contrasena: this.contrasena
      };
      console.log(this.correo);
      this.correo = "";
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
                this.menuCtrl.enable(true, 'trabajador');
                this.menuCtrl.enable(false, 'lugar');                                
                this.nav.setRoot(RegistrarPage);
                this.loginService.setCorreoTrabajador(res.mensaje.trabajadores._id);
              }  
         }else{
           alert(res.mensaje);
         }
        });

      // this.correo = "";
      // this.contrasenia = "";
    }
  }
}
