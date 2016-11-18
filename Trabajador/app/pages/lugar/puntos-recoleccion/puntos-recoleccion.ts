import { Component } from '@angular/core';
import { NavController, Alert, AlertController, ActionSheetController, Platform} from 'ionic-angular';


//datos de acceso
import { LogInService } from '../../../providers/logIn-service/logIn-service';

//Servicio de llamados http 
import { PuntosService} from '../../../providers/lugar-service/puntos-service';

@Component({ 
   templateUrl: 'build/pages/lugar/puntos-recoleccion/puntos-recoleccion.html',
   providers: [PuntosService]
})

export class PuntosRecoleccionPage {
    private puntosRecoleccion: any; //resultado de la consulta
    private correoLugar: any; //datos de acceso a la informacion

    constructor(private navCtrl: NavController, private alertCtrl: AlertController, 
                private puntosService: PuntosService, private actionSheetCtrl: ActionSheetController,
                public platform: Platform, private login: LogInService){
                    this.correoLugar = this.login.getCorreoLugar();
                } 
 
  /**
   * Llamado cada que se entra en la pagina 
   */
  ionViewWillEnter() { 
      this.cargarPuntosRecoleccion();
    }

    /**
    *   Me consulta los puntos de recoleccion disponibles segun el lugar
    */
    public cargarPuntosRecoleccion(){
        let correo = {correoLugar: this.correoLugar}
        this.puntosService.consultarPuntos(correo)
        .subscribe( (data) => {
            if(data.correcto)
                this.puntosRecoleccion = data.mensaje;
            else 
                alert(data.mensaje);
                       console.log("cargando puntos de recoleccion "+this.correoLugar);
            console.log("cargando puntos de recoleccion "+this.puntosRecoleccion);
        });
    }

    /**
     * Alerta generada al hacer clic en agregar
     * y encargada de verificar si el nombre existia anteriormente 
     */
    public agregarPunto(){
        let alerta = this.alertCtrl.create({
            title: 'Agregar Punto',
            inputs: [
                {
                    name: 'nombre',
                    placeholder: 'Nombre',
                    type: 'text',              
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
                    let navTransition = alerta.dismiss();
                    let nombrePunto = data.nombrePunto;
                    let consulta = {
                        correoLugar: this.correoLugar,
                        nombre: data.nombre
                    }
               
                    this.puntosService.confirmarPunto(consulta).subscribe((datos) => {
                        if(datos.correcto && !datos.existio){             
                            navTransition.then(() => {
                                this.nuevoPunto(data.nombre);
                            });
                        }else{
                            navTransition.then(() => {
                                 alert(datos.mensaje);
                                 this.cargarPuntosRecoleccion();
                            });
                         
                        }
                    });
                    return false;
                }
            }
            ]
        });
        alerta.present();
   }

    /**
    * Luego de verificar el nombre,
    * si este no existia, creamos un nuevo punto.
    */
   public nuevoPunto(nombre){
       let alerta = this.alertCtrl.create({
            title: 'Nuevo Punto',
            subTitle: 'Creando el punto '+nombre,
            inputs: [
                {
                    name: 'telefono',
                    placeholder: 'Telefono',
                    type: 'tel'
                },
                {
                    name: 'ubicacion',
                    placeholder: 'Ubicación',
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
                text: 'Crear',
                handler: data => {
                    let navTransition = alerta.dismiss();
                    let nuevoPunto = {
                        correoLugar: this.correoLugar,
                        nombre: nombre,
                        telefono: data.telefono,
                        direccion: data.ubicacion,
                    }

                    this.puntosService.crearPunto(nuevoPunto)
                    .subscribe(data =>{           
                        navTransition.then(() => {
                            alert(data.mensaje);
                            this.cargarPuntosRecoleccion();
                        }); 
                    });
                    return false;
                }
            }
            ]
        });
        alerta.present();
   }

    /**
     * ActionSheet de opciones del punto de recoleccion 
     */
    public opcionesPunto(event, punto) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modificar Punto',
            cssClass: 'action-sheets-basic-page',
            buttons: [
            { 
                text: 'Editar',
                icon: !this.platform.is('ios') ? 'create' : null,
                handler: () => {
                    console.log('editar clicked');
                    let navTransition = actionSheet.dismiss();                    
                    navTransition.then(() => {
                        this.editarPunto(punto);

                    });  
                  
                }
            },{
                text: 'Eliminar',
                role: 'destructive',
                icon: !this.platform.is('ios') ? 'trash' : null,
                handler: () => {
                    console.log('Delete clicked');
                    let navTransition = actionSheet.dismiss();
                     navTransition.then(() => {
                        this.eliminarPunto(punto);
                    });
                     
                   
                }
            },{
                text: 'Cancelar',
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

 /**
        * editar nombre,telefono,direccion del punto
        */ 
       public editarPunto(punto){
        let alerta = this.alertCtrl.create({
                title: 'Editar Punto',
                inputs: [
                {
                    name: 'nombre',
                    placeholder: 'Nombre',
                    type: 'text',
                    value: punto.puntosRecoleccion.nombre
                },
                {
                    name: 'telefono',
                    placeholder: 'Telefono',
                    type: 'tel',
                    value: punto.puntosRecoleccion.telefono
                },
                {
                    name: 'direccion',
                    placeholder: 'Ubicación',
                    type: 'text',
                    value: punto.puntosRecoleccion.direccion
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
                    text: 'Aceptar',
                    handler: data => {
                
                        let navTransition = alerta.dismiss();
                        let datos = {
                            correoLugar: this.correoLugar,
                            nombrePuntoRecoleccion: punto.puntosRecoleccion.nombre, //por ahora no se podra modificar
                            telefono: data.telefono,
                            direccion: data.direccion,
                        }
        
                        this.puntosService.modificarPunto(datos).
                        subscribe(data => {           
                            navTransition.then(() => {
                                alert(data.mensaje);
                                this.cargarPuntosRecoleccion();
                            }); 
                        });
                        return false;
                    }
                }
                ]
            });
    alerta.present();
   }

  
   /**
    * Eliminar un Punto de un lugar
    */
   eliminarPunto(punto) {
    let alerta = this.alertCtrl.create({
        title: 'Eliminar punto',
        message: '¿Quiere borrar el punto '+punto.puntosRecoleccion.nombre+'?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            console.log('Cancel clicked');
            }
        },
        {
            text: 'Eliminar',
            handler: () => {
                console.log('eliminar clicked');
                console.log(punto.puntosRecoleccion.nombre);
                let navTransition = alerta.dismiss();
                let datos = {
                    correoLugar: this.correoLugar,
                    nombrePuntoRecoleccion: punto.puntosRecoleccion.nombre
                }
                this.puntosService.eliminarPunto(datos)
                .subscribe( (data) => {
                    navTransition.then(() => {
                        alert(data.mensaje);
                        this.cargarPuntosRecoleccion();
                    }); 
                });
                return false;
            }
        }
        ]
    });
    alerta.present();
    }



}
