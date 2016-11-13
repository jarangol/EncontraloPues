import { Component } from '@angular/core';
import { NavController, AlertController, Alert, ActionSheetController, Platform} from 'ionic-angular';

//Servicio de llamados http 
import { TrabajadoresService} from '../../../providers/lugar-service/trabajadores-service';

@Component({ 
   templateUrl: 'build/pages/lugar/trabajadores/trabajadores.html',
   providers: [TrabajadoresService],
})

export class TrabajadoresPage {
    private trabajadores: any; //resultado de la consulta
    private correoLugar: any = 'Eafit@';//datos de acceso a la informacion
   
    constructor(private navCtrl: NavController, private alertCtrl: AlertController, 
                private trabajadoresService: TrabajadoresService,  private actionSheetCtrl: ActionSheetController,
                 public platform: Platform){ }
   
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



    public itemOptions(event, trabajador) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modificar Trabajador',
            cssClass: 'action-sheets-basic-page',
            buttons: [
            { 
            text: 'Editar',
            icon: !this.platform.is('ios') ? 'build' : null,
            handler: () => {
            console.log('Share clicked');
            }
            },{ 
            text: 'Cambiar contraseña',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
            console.log('Share clicked');
            }
            },{
            text: 'Borrar',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
                console.log('Delete clicked');
            }
            },
            { 
            text: 'Play',
            icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
            handler: () => {
                console.log('Play clicked');
            }
            },
            {
            text: 'Favorite',
            icon: !this.platform.is('ios') ? 'heart-outline' : null,
            handler: () => {
                console.log('Favorite clicked');
            }
            },
            {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                console.log('Cancel clicked');
            }
            }
        ]
        });
    actionSheet.present();;
    }
 }

