import { Component } from '@angular/core';
import { NavController, Alert, AlertController} from 'ionic-angular';

//Servicio de llamados http 
import { PuntosService} from '../../../providers/lugar-service/puntos-service';

@Component({ 
   templateUrl: 'build/pages/lugar/puntos-recoleccion/puntos-recoleccion.html',
   providers: [PuntosService]
})

export class PuntosRecoleccionPage {
    private puntosRecoleccion: any; //resultado de la consulta
    private correoLugar: any; //datos de acceso a la informacion

    constructor(private navCtrl: NavController, private alertCtrl: AlertController, private puntosService: PuntosService){

    }


    ionViewLoaded(){
        this.cargarPuntosRecoleccion();
    }

    public cargarPuntosRecoleccion(){
        let correo = {correoLugar: this.correoLugar}
        this.puntosService.consultarPuntos(correo)
        .subscribe( (data) => {
            this.puntosRecoleccion = data;
            console.log("cargando puntos de recoleccion "+this.puntosRecoleccion);
        });
    }

    itemTapped(event, trabajador) {
        //detallar los datos
    }

        public nuevoPunto(){
        let alert = this.alertCtrl.create({
            title: 'Agregar Punto de Recolección',
            inputs: [
                {
                    name: 'nombre',
                    placeholder: 'Nombre',
                    type: 'text',
                },
                {
                    name: 'telefono',
                    placeholder: 'Telefono',
                    type: 'tel'
                },
                {
                    name: 'direccion',
                    placeholder: 'Dirección',
                    type: 'text'
                }
            ],
            buttons: [
            {
                text: 'Atras',
                role: 'cancel',
                handler: data => {
                console.log('Cancel clicked');
                }
            },
            {
                text: 'Añadir',
                handler: data => {
                    // if (User.isValid(data.username, data.password)) {
                    //     // logged in!
                    // } else {
                    //     // invalid login
                    //     return false;
                    // }
                }
            }
            ]
        });
        alert.present();
   }
}
