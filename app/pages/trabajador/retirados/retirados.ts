import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Service para los llamados http
import { RetiradosService} from '../../../providers/retirados-service/retirados-service';

//Pagina para mostrar en detalle cada item
import { DetalleRetiradoPage} from '../detalle-retirado/detalle-retirado';

//pagina para resultado de la busqueda
import { ListarRetiradosPage} from '../listar-retirados/listar-retirados';



@Component({
  templateUrl: 'build/pages/trabajador/retirados/retirados.html',
    providers: [RetiradosService],
})

export class RetiradosPage {
  //atributos de la vista
  private tipoBusqueda: any; //Indica el tipo de busqueda que se desea hacer
  private qrCode: string; //codigo escaneado
  private tags: Array<String>; //arreglo de tags ingresados
  private fecha: any; //fecha del registro (YYYY-MM)
  private codigoBusqueda: any; //ingresado por el usuario  
  
  private objetos: any; //Objetos retirados que devuelve la consulta

  //campos para la consulta
  private nombrePunto: any;
  private correoLugar: string;
  private nombreLugar: string;
  private correoTrabajador: string; 


  constructor(private navCtrl: NavController, private retiradosService: RetiradosService) {
  	this.tipoBusqueda = 'fecha';

		 this.tags = [];
		 var hoy = new Date();
		 var mm = hoy.getMonth()+1; //hoy es 0!
		 var yyyy = hoy.getFullYear();
		 this.fecha = yyyy+'-'+mm;

		 //temporal y desaparece con el login
  	 this.correoLugar="Eafit@";
     this.nombrePunto="b";
     this.correoTrabajador="m";
     this.nombreLugar="d";
  }

  public buscar(){
      if(this.tipoBusqueda=='fecha' && this.fecha ){
        let consulta = {
          anoMesRegistro : this.fecha,
          tags: this.tags,
          correoLugar: this.correoLugar,
          nombrePunto: this.nombrePunto,
        }

   
        this.retiradosService.consultarRetiradosFecha(consulta)
        .then((data) => {
          console.log("resultado: "+data);
          this.objetos = data;

            this.navCtrl.push(ListarRetiradosPage,{ 	 					
              registros: data.mensaje, //pasarle especificamente el atributo sin el mensaje
              fecha: this.fecha
            });
  
        });

      }else if(this.tipoBusqueda=='codigo' && this.codigoBusqueda){
          let consulta = {
            codigoBusqueda: this.codigoBusqueda,
            correoLugar: this.correoLugar,
          }
          this.retiradosService.consultarRetiradosCodigo(consulta)
          .then((data) => {

            console.log(data);
            this.objetos=data;
            
            if(this.objetos.correcto){
                this.navCtrl.push(DetalleRetiradoPage,{ 	 					
                  registro: data.mensaje, //pasarle especificamente el atributo sin el mensaje
                });
            }
          });
           this.codigoBusqueda = "";
      }
       
      
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
