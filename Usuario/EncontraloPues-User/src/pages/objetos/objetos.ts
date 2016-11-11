import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Agregarobjts } from '../agregarobjts/agregarobjts'
import {AuthService} from '../../services/auth/auth.service';


/*
  Generated class for the Objetos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-objetos',
  templateUrl: 'objetos.html'
})
export class Objetos {
  objetos: any = [];
  
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
  public auth: AuthService) {}

  ionViewDidLoad() {
    console.log('Hello Objetos Page');
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
 

}
