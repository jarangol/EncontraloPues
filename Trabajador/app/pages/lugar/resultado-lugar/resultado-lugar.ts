import { Component } from '@angular/core';
import { NavController,Platform, Alert, Page, NavParams, ActionSheetController} from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';
import { RegistroService} from '../../../providers/registro-service/registro-service';

// Pagina para navegar al detalle del objeto segun su tipo
import { ObjetoPerdidoPage} from '../objeto-perdido/objeto-perdido';
import { ObjetoRetiradoPage} from '../objeto-retirado/objeto-retirado';




@Component({ 
   templateUrl: 'build/pages/lugar/resultado-lugar/resultado-lugar.html',
   providers: [LugarService]
})

export class ResultadoLugarPage { 
  //me los pasan como navParams desde la vista retirar
  private correoLugar: any;
  private anoMes: any; //año, mes con que se filtra la busqueda
  private registros: any; //resultado d ela busqueda
  private tipoObjetos: any;
  private consulta: any;

    constructor(private navCtrl: NavController, public lugarService: LugarService,
               public navParams: NavParams, private platform:Platform, 
               private actionSheetCtrl: ActionSheetController,
               private registroService:RegistroService){
      

      this.consulta = this.navParams.get('consulta');
      if(this.consulta){ 
        this.correoLugar = this.consulta.correoLugar;
        this.anoMes = this.consulta.anoMesRegistro;
      }
      
      this.tipoObjetos = this.navParams.get('tipoObjetos');
  
      this.registros= this.navParams.get('registros');
    } 

	ionViewLoaded(){
   this.cargarRegistros();
	}

  public cargarRegistros(){
    this.lugarService.consultarPerdidosFecha(this.consulta)
    .subscribe((data) => {
        if(data.correcto)
          this.registros = data.mensaje;
        else
          alert(data.mensaje);
    });
  }

   public itemTapped(event, registro) {
      if(this.tipoObjetos == 'perdidos')
        this.opcionesObjeto(event,registro);   
      else if(this.tipoObjetos == 'retirados')
        this.navCtrl.push(ObjetoRetiradoPage, {
          registro: registro,
        });
     }

    /**
     * ActionSheet de opciones del trabajador
     */
   public opcionesObjeto(event, registro) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Opciones del objeto',
            cssClass: 'action-sheets-basic-page',
            buttons: [
            { 
                text: 'Ver',
                icon: !this.platform.is('ios') ? 'eye' : null,
                handler: () => {
                    console.log('ver clicked');
                    actionSheet.dismiss().then(() => {
                       this.navCtrl.push(ObjetoPerdidoPage, {
                        registro: registro,
                        correoLugar: this.correoLugar,
                        editar: false, 
                      });

                    });  
                  
                }
            },{
                text: 'Eliminar',
                role: 'destructive',
                icon: !this.platform.is('ios') ? 'trash' : null,
                handler: () => {
                    console.log('Delete clicked');
                
                      let datos = {
                        correoLugar: this.correoLugar,
                        nombrePunto: registro.puntosRecoleccion.nombre,
                        codigoBusqueda: registro.puntosRecoleccion.objetosPerdidos.codigoBusqueda
                      }
                      console.log( this.correoLugar);
                      console.log(registro.puntosRecoleccion.nombre);
                      console.log(registro.puntosRecoleccion.objetosPerdidos.codigoBusqueda);
                      this.registroService.borrarPerdido(datos).subscribe(data =>{
                        actionSheet.dismiss().then(() => {
                          this.cargarRegistros();
                        });
                      });
                       
                   return false;
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
        if(registro.puntosRecoleccion.objetosPerdidos.sinCodigoQR){ 
            actionSheet.addButton({ 
                  text: 'Editar',
                  icon: !this.platform.is('ios') ? 'create' : null,
                  handler: () => {
                      console.log('editar clicked');
                      actionSheet.dismiss().then(() => {
                        this.navCtrl.push(ObjetoPerdidoPage, {
                          registro: registro,
                          correoLugar: this.correoLugar,
                          editar: true, 
                        });

                      });   
                    return false;
                  }
              });
        }
              
    actionSheet.present();
    }
 }
