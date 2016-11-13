import { Component } from '@angular/core';
import { NavController, AlertController, Alert} from 'ionic-angular';

//Servicio de llamados http 
import { TrabajadoresService} from '../../../providers/lugar-service/trabajadores-service';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajadores/trabajadores.html',
   providers: [TrabajadoresService],
})

export class TrabajadoresPage {
    private trabajadores: any; //resultado de la consulta
    private correoLugar: any = 'Eafit@';//datos de acceso a la informacion
   
    constructor(private navCtrl: NavController, private alertCtrl: AlertController, private trabajadoresService: TrabajadoresService){ 
        console.log(this.correoLugar);
    }
   
   ionViewWillEnter() { // se llama todo lo que se quiere que se refreseque en la pag
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

    public agregarTrabajador(){
        let alerta = this.alertCtrl.create({
            title: 'Agregar trabajador',
            inputs: [
                {
                    name: 'correo',
                    placeholder: 'Correo',
                    type: 'email',              
                }
            ],
            buttons: [
            {
                text: 'Atrás',
                role: 'cancel',
                handler: data => {
                console.log('Cancel clicked');
                }
            },
            {
                text: 'Enviar',
                handler: data => {
                console.log(data.correo);  
                    let navTransition = alerta.dismiss();
                    let correoTrabajador = data.correo;
                    let correo = {
                        correoLugar: this.correoLugar,
                        correoTrabajador: correoTrabajador,
                    }
               
                    this.trabajadoresService.confirmarTrabajador(correo).subscribe((datos) => {
                    console.log("respondiendo"+datos.correcto);
                    console.log("respondiendo"+datos.existio);
                        if(datos.correcto && !datos.existio){             
                            navTransition.then(() => {
                                this.nuevoTrabajador(correoTrabajador);
                            });
                        }else{
                            alert(datos.mensaje);
                        }
                    });
                    return false;
                }
            }
            ]
        });
        alerta.present();
   }


   public nuevoTrabajador(correo){
       let alerta = this.alertCtrl.create({
            title: 'Nuevo trabajador',
            inputs: [
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
                text: 'Crear',
                handler: data => {
                    let navTransition = alerta.dismiss();
                    let trabajador = {
                        correoLugar: this.correoLugar,
                        correoTrabajador: correo,
                        nombre: data.nombre,
                        contraseña: data.contrasena,
                    }
    
                    this.trabajadoresService.crearTrabajador(trabajador)
                    .subscribe(data => {           
                        navTransition.then(() => {
                             alert(data.mensaje);
                              this.cargarTrabajadores();
                        }); 
                    });
                }
            }
            ]
        });
        alerta.present();
   }
}
