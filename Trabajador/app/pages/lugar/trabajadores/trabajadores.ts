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
   
   /**
    * Se llama al iniciar la pagina para refrescar fatos
    */
   ionViewWillEnter() { // se llama todo lo que se quiere que se refreseque en la pag
     this.cargarTrabajadores();
    }

  
    /**
     * Consulta los trabajadores del lugar
     */
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


    /**
     * Alerta generada al acer clic en agregar
     * y encargada de verificar si el correo existia 
     */
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
                        if(datos.correcto && !datos.existio){             
                            navTransition.then(() => {
                                this.nuevoTrabajador(correoTrabajador);
                            });
                        }else{
                            navTransition.then(() => {
                                 alert(datos.mensaje);
                                 this.cargarTrabajadores();
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
    * Luego de verificar el correo,
    * si este no existia, creamos un nuevo trabajador.
    */
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

                    this.trabajadoresService.crearTrabajador(trabajador).subscribe(data => {           
                        navTransition.then(() => {
                            alert(data.mensaje);
                            this.cargarTrabajadores();
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
     * ActionSheet de opciones del trabajador
     */
    public opcionesTrabajador(event, trabajador) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modificar Trabajador',
            cssClass: 'action-sheets-basic-page',
            buttons: [
            { 
                text: 'Editar',
                icon: !this.platform.is('ios') ? 'create' : null,
                handler: () => {
                    console.log('editar clicked');
                    let navTransition = actionSheet.dismiss();                    
                    navTransition.then(() => {
                        this.editarTrabajador(trabajador);

                    });  
                  
                }
            },{ 
                text: 'Cambiar contraseña',
                icon: !this.platform.is('ios') ? 'key' : null,
                handler: () => {
                    console.log('cambiar contraseña clicked');
                    let navTransition = actionSheet.dismiss();
                     navTransition.then(() => {
                         this.cambiarContrasena(trabajador);
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
                    });
                        this.eliminarTrabajador(trabajador);
                   
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
        * editar nombre y correo del trabajador
        */ 
       public editarTrabajador(trabajador){
        let alerta = this.alertCtrl.create({
                title: 'Editar trabajador',
                inputs: [
                    {
                        name: 'nombre',
                        placeholder: 'Nombre',
                        type: 'text',
                        value: trabajador.trabajadores.nombre,
                    },
                    {
                        name: 'correo',
                        placeholder: 'Correo',
                        type: 'email',  
                        value: trabajador.trabajadores._id   
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
                        console.log(data.correo);
                
                        let navTransition = alerta.dismiss();
                        let datos = {
                            correoLugar: this.correoLugar,
                            correoTrabajador: data.correo,
                            nombre: data.nombre,
                            //la contraseña no cambia
                            contraseña: trabajador.trabajadores.contrasena,
                        }
        
                        this.trabajadoresService.modificarTrabajador(datos).
                        subscribe(data => {           
                            navTransition.then(() => {
                                alert(data.mensaje);
                                this.cargarTrabajadores();
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
    * cambiar contraseña de un trabajador
    */
   public cambiarContrasena(trabajador){
        let alerta = this.alertCtrl.create({
                title: 'Editar trabajador',
                inputs: [
                    {
                        name: 'nueva',
                        placeholder: 'Nueva contraseña',
                        type: 'password',
                    },
                    {
                        name: 'repetir',
                        placeholder: 'Repetir nueva contraseña',
                        type: 'password',     
                    }
                ],
                buttons: [
                {
                    text: 'Atrás',
                    role: 'cancel',
                },
                {
                    text: 'Aceptar',
                    handler: data => {
                        
                        if(data.nueva == data.repetir){
                            let navTransition = alerta.dismiss();
                            let datos = {
                                correoLugar: this.correoLugar,
                                correoTrabajador: trabajador.trabajadores._id,
                                nombre: trabajador.trabajadores.nombre,
                                contraseña: data.nueva,
                            }
            
                            this.trabajadoresService.modificarTrabajador(datos).subscribe(data => {           
                                navTransition.then(() => {
                                    alert(data.mensaje);
                                    this.cargarTrabajadores();
                                }); 
                            });
                        }else
                            alerta.setMessage("Las constraseñas no coinciden, intente de nuevo.");
                        return false;
                    }
                }
                ]
            });
    alerta.present();
   }

   /**
    * Eliminar un trabajador de un lugar
    */
   eliminarTrabajador(trabajador) {
    let alerta = this.alertCtrl.create({
        title: 'Eliminar trabajador',
        message: '¿Quiere borrar a '+trabajador.trabajadores.nombre+'?',
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
                let navTransition = alerta.dismiss();
                let datos = {
                    correoLugar: this.correoLugar,
                    correoTrabajador: trabajador.trabajadores._id
                }
                this.trabajadoresService.eliminarTrabajador(datos)
                .subscribe( (data) => {
                    navTransition.then(() => {
                        alert(data.mensaje);
                        this.cargarTrabajadores();
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

