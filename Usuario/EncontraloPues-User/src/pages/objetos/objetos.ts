import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Agregarobjts } from '../agregarobjts/agregarobjts'
import { AuthService } from '../../services/auth/auth.service';
import { ObtenerObjetos } from '../../providers/obtener-objetos';


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

    
        // let prompt = this.alertCtrl.create({
        //     title: 'Add Note',
        //     inputs: [{
        //         name: 'title'
        //     }],
        //     buttons: [
        //         {
        //             text: 'Cancel'
        //         },
        //         {
        //             text: 'Add',
        //             handler: data => {
        //                 this.objetos.push(data);
        //             }
        //         }
        //     ]
        // });
 
        // prompt.present();
    }

    editObjt(obj){
 
        let prompt = this.alertCtrl.create({
            title: 'Edita el Objeto',
            inputs: [{
                name: 'titulo'
            }],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Save',
                    handler: data => {
                        let index = this.objetos.indexOf(obj);
 
                        if(index > -1){
                          this.objetos[index] = obj;
                        }
                    }
                }
            ]
        });
 
        prompt.present();       
    }

     deleteObjt(obj){
 
        let index = this.objetos.indexOf(obj);
 
        if(index > -1){
            this.objetos.splice(obj, 1);
        }
    }

    refresh(){
        this.navCtrl.setRoot(Objetos);
    }

    public obtenerObjetos(){
        if(this.auth.authenticated()){
            console.log(this.usuario.email);
            console.log("esta autentificado");
            
        }else
        console.log("no esta autentificado");
    }
 

}
