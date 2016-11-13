import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Agregarobjts } from '../agregarobjts/agregarobjts'
import { AuthService } from '../../services/auth/auth.service';
import { ObtenerObjetos } from '../../providers/obtener-objetos';
import { Generadorqr } from '../generadorqr/generadorqr';


/*
  Generated class for the Objetos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-objetos',
  templateUrl: 'objetos.html',
  providers: [ObtenerObjetos],
})

export class Objetos {
  objetos: any = [];
  usuario: any;
  resulConsulta: any;
  
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
  public auth: AuthService, private obtenerService : ObtenerObjetos ) {
    this.usuario = auth.user;
  }

  ionViewDidLoad() {
    console.log('Hello Objetos Page');
    this.obtenerObjetos();
  }

  addObjt(){
    this.navCtrl.push(Agregarobjts); // pasar despues los parametros de navegacion
    }

    editObjt(){
 
    this.navCtrl.push(Agregarobjts); // pasar despues los parametros de navegacion
               
    }

     deleteObjt(obj){
 
        let index = this.objetos.indexOf(obj);
 
        if(index > -1){
            this.objetos.splice(obj, 1);
        }
    }

    public generarQr(codigoQr){
        this.navCtrl.push(Generadorqr,{codigoQr: codigoQr});
        console.log(codigoQr);
    }


    public obtenerObjetos(){
        if(this.auth.authenticated()){
            console.log(this.usuario.email);
            console.log("esta autentificado");
            let consulta = {
                correoUsuario : this.usuario.email
            }

            this.obtenerService.consultarObjetosUsuario(consulta).subscribe((data) =>
            {
                // this.resulConsulta = data;
                
                if(data.correcto){
                     this.resulConsulta = data.mensaje;
                    // console.log("json de objetos " + this.resulConsulta.objetosPersonales.codigoQR);
                }else{
                    alert(data.mensaje);
                }
            });
        }
    }
 

}
