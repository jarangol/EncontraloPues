import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

//pagina para resultado de la busqueda
import { ResultadoLugarPage} from '../resultado-lugar/resultado-lugar';


@Component({
  templateUrl: 'build/pages/lugar/buscar-lugar/buscar-lugar.html',
  providers: [LugarService],
})


export class BuscarLugarPage {
  //campos de la interfas (ngModels)
	private tags: any;
	private codigoBusqueda: any;
	private fecha: any;

  //datos necesarios para consultas
  private correoLugar: any;
  private nombrePunto: any;

  private registros: any; //para guardar resultados de consultas.

  constructor(private navCtrl: NavController,private lugarService: LugarService) {
  	this.tags = [];
  }


  public addTag(tagNameInput: any): void {
    if(tagNameInput.value) {
      // Add the tag
      this.tags.push(tagNameInput.value);

      tagNameInput.value = '';
    }
  }
  
  public deleteTag(tagName: string) {
    let index = this.tags.indexOf(tagName);  
    this.tags.splice(index, 1);
  } 

   public buscar(){
  	if(this.fecha){
  		let consulta = {
  			añoMesRegistro : this.fecha,
  			codigoBusqueda: this.codigoBusqueda,
  			tags: this.tags,
  			correoLugar: this.correoLugar,
	  		codigoObjeto: this.codigoBusqueda,
	  		
  		}
  		
			
			this.lugarService.consultarPerdidosLugar(consulta)
				.then((data) => {
						this.registros = data;
						console.log("Resultado consulta: "+data);
				});

				this.registros = this.registros;
				
				this.navCtrl.push(ResultadoLugarPage,{ 	 	
					
					correoLugar: this.correoLugar,
					nombrePunto: this.nombrePunto,
					codigoBusqueda: this.codigoBusqueda,
					registros: this.registros.lugar.puntosRecoleccion ,

				});
				this.codigoBusqueda = "";
			this.registros=null;
		}	
  }

  

}
