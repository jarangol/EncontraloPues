import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LogInService } from '../../providers/logIn-service/logIn-service';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [LogInService]
})

export class Login {

  private correo: any;
  private contrasenia: any;

  validacion:any;

  constructor(public navCtrl: NavController, public loginService: LogInService) { }

  validar() {
    alert("llame a validar");
    if (this.correo && this.contrasenia) {

      let validacion = {
        correoElectronico: this.correo,
        contrasenia: this.contrasenia  
      };
      
      this.loginService.validarInfo(validacion).
      then((res) => {
        alert(res);
        this.validacion = res;
      });

      this.correo = "";
      this.contrasenia = "";
    }
  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

}
