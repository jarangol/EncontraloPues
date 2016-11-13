import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';

//Servicio de llamados http 
import { TrabajadoresService} from '../../../providers/lugar-service/trabajadores-service';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajadores/trabajadores.html',
   providers: [TrabajadoresService]
})

export class TrabajadoresPage {
    private trabajadores: any; //resultado de la consulta
    private correoLugar: any;
   
    constructor(private navCtrl: NavController, private alertCtrl: AlertController, private trabajadoresService: TrabajadoresService){ 

    }


    ionViewLoaded(){
        this.cargarTrabajadores();
    }

    public cargarTrabajadores(){
        let correo = { correoLugar: this.correoLugar}
        this.trabajadoresService.consultarTrabajadores(correo)
        .subscribe((data) => {
            if(data.correcto)
                this.trabajadores = data.mensaje;
            else 
                alert(data.mensaje);
            console.log("cargando trabajadores "+this.trabajadores);
        })
    }

    public itemTapped(event, trabajador) {
        //detallar los datos
    }

    public nuevoTrabajador(){
        let alert = this.alertCtrl.create({
            title: 'Agregar trabajador',
            inputs: [
                {
                    name: 'correo',
                    placeholder: 'Correo',
                    type: 'email',
                },
                {
                    name: 'nombre',
                    placeholder: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'contrasena',
                    placeholder: 'Contraseña',
                    type: 'password'
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

