import { Component } from '@angular/core';
import { NavController, Alert, AlertController} from 'ionic-angular';

//Service para los llamados http
import { RetiradosService} from '../../../providers/retirados-service/retirados-service';

//Pagina para mostrar en detalle cada item
import { DetalleRetiradoPage} from '../detalle-retirado/detalle-retirado';

//pagina para resultado de la busqueda
import { ListarRetiradosPage} from '../listar-retirados/listar-retirados';


//datos de acceso
import { LogInService } from '../../../providers/logIn-service/logIn-service';

@Component({
  templateUrl: 'build/pages/trabajador/retirados/retirados.html',
   // providers: [RetiradosService],
})

export class RetiradosPage {
  //atributos de la vista
  private tipoBusqueda: any; //Indica el tipo de busqueda que se desea hacer
  private tags: Array<String>; //arreglo de tags ingresados
  private fecha: any; //fecha del registro (YYYY-MM)
  private codigoBusqueda: any; //ingresado por el usuario  
  
  private objetos: any; //Objetos retirados que devuelve la consulta

  //campos para la consulta
  private nombrePunto: any;
  private correoLugar: string;
  private correoTrabajador: string; 
 // private retiradosService: RetiradosService;

  constructor(private navCtrl: NavController, private retiradosService: RetiradosService,
              private alertCtrl: AlertController, private login: LogInService) {
    this.tipoBusqueda = 'fecha';

		 this.tags = [];
		 var hoy = new Date();
		 var mm = hoy.getMonth()+1; //hoy es 0!
		 var yyyy = hoy.getFullYear();
		 this.fecha = yyyy+'-'+mm;

      //datos necesarios
      this.correoLugar = this.login.getCorreoLugar();
      this.nombrePunto = this.login.getPuntoTrabajador();
      this.correoTrabajador = this.login.getCorreoTrabajador();
  }

  public buscar(){
      if(this.tipoBusqueda=='fecha' && this.fecha ){
        let consulta = {
          anoMesRegistro : this.fecha,
          tags: this.tags,
          correoLugar: this.correoLugar,
          nombrePunto: this.nombrePunto
        }

   
        this.retiradosService.consultarRetiradosFecha(consulta)
          .subscribe(data => {
            this.objetos = data;
            console.log(this.objetos);
            if(this.objetos.correcto){  
              this.navCtrl.push(ListarRetiradosPage,{ 	 					
                registros: this.objetos.mensaje, 
                fecha: this.fecha
              });
          }else{
            alert(this.objetos.mensaje);
          }
        });
      }
  }

   /**
    * Busca un objeto retirado por su consecutivo
    */
   public buscarConsecutivo() {
    this.tipoBusqueda = "fecha";
    let prompt = this.alertCtrl.create({
      title: 'Buscar consecutivo',
      message: "Ingrese el consecutivo completo del objeto retirado.",
      inputs: [
        {
          name: 'consecutivo',
          placeholder: 'Consecutivo',
					type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
					
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            let consulta = {
              codigoBusqueda: data.consecutivo,
              correoLugar: this.correoLugar,
            }

            this.retiradosService.consultarRetiradosCodigo(consulta)
            .subscribe(data => {
              if(data.correcto){
                  prompt.dismiss().then(() => {                 
                    this.navCtrl.push(DetalleRetiradoPage,{ 	 					
                      registro: data.mensaje, 
                    });
                  });
              }else{
                alert(data.mensaje);
              }       
            });  
         }
        }
      ]
    });
    prompt.present();
  }

/**
 * Para agregar un nuevo tag al arreglo
 */
  public addTag(tagNameInput: any): void {
    if(tagNameInput.value) {
      this.tags.push(tagNameInput.value);
      tagNameInput.value = '';
    }
  }
  
  /**
   * Para eliminar un tag del arreglo
   */
  public deleteTag(tagName: string) {
    let index = this.tags.indexOf(tagName);  
    this.tags.splice(index, 1);
  } 
}
