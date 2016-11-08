import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

//Pagina para mostrar en detalle cada item
import { DetalleRetiradoPage} from '../../detalle-retirado/detalle-retirado';

//page de detalle del retiro
import { DetalleRetiroPage} from '../../trabajador/detalle-retiro/detalle-retiro';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

//pagina para resultado de la busqueda
import { ListarRetiradosPage} from '../../listar-retirados/listar-retirados';

//pagina para resultado de la busqueda
import { ListarPerdidosPage} from '../../listar-perdidos/listar-perdidos';


@Component({
  templateUrl: 'build/pages/lugar/buscar-lugar/buscar-lugar.html',
  providers: [LugarService],
})


export class BuscarLugarPage {
  //campos de la interfaz (ngModels)
	private tipoBusqueda: any; //por fecha o consecutivo
	private tipoObjetos: any; //perdidos o retirados
	private puntoRecoleccion: any;	//elegido en un select
	private fecha: any; 
	private tags: any;
	private codigoBusqueda: any; //consecutivo
	
	//lista de los puntosRecoleccion
	private puntosRecoleccion: any;


  //datos necesarios para consultas
  private correoLugar: any;
  private nombrePunto: any;

  private registros: any; //para guardar resultados de consultas.

  constructor(private navCtrl: NavController,public navParams: NavParams,private lugarService: LugarService) {
  	//inicializando algunos campos
		this.tags = [];
		this.tipoBusqueda = 'fecha';
		this.tipoObjetos = 'perdidos';
		this.puntoRecoleccion = 'Todos';
		
		//actualizar fecha a la actual (mes y ano)
		var hoy = new Date();
		var mm = hoy.getMonth()+1; //hoy es 0!
		var yyyy = hoy.getFullYear();
		this.fecha = yyyy+'-'+mm;

		//datos necesarios
		this.correoLugar="Eafit@";
  	   this.nombrePunto="b";

  }


	ionViewLoaded(){
		this.cargarPuntos();
	}
	/**
	 * Cargar los puntos de recoleccion para consultar 
	 * Segun si son los objetos perdidos o retirados
	 */
	public cargarPuntos(){
		let correoBody={
        	correoLugar: this.correoLugar
      	}
		if(this.tipoObjetos == 'perdidos'){
			this.lugarService.consultarPuntosPerdidos(correoBody)
			.subscribe(data => {
            	this.puntosRecoleccion = data;
				console.log("puntos"+this.puntosRecoleccion);
     		 });
		}else if(this.tipoObjetos == 'retirados'){
			this.lugarService.consultarPuntosRetirados(correoBody)
			.subscribe(data => {
            	this.puntosRecoleccion = data;
				console.log("retirados"+this.puntosRecoleccion);
     		 });
		}
	}

  public addTag(tagNameInput: any): void {
    if(tagNameInput.value) {
      this.tags.push(tagNameInput.value);
      tagNameInput.value = '';
    }
  }
  
  public deleteTag(tagName: string) {
    let index = this.tags.indexOf(tagName);  
    this.tags.splice(index, 1);
  } 

   public buscar(){

		 if(this.tipoBusqueda == 'fecha'){
			let consulta = {
				anoMesRegistro : this.fecha,
				tags: this.tags,
				correoLugar: this.correoLugar,
				nombrePunto: this.nombrePunto
			}

			if(this.tipoObjetos == 'perdidos'){						
				this.lugarService.consultarPerdidosFecha(consulta)
				.then((data) => {
					this.registros = data;
					console.log("consulta perdidos-fecha: "+data);
					if(this.registros.correcto){
						this.navCtrl.push(ListarPerdidosPage,{ 	 						
							correoLugar: this.correoLugar,
							nombrePunto: this.nombrePunto,
							registros: this.registros.mensaje,
							fecha: this.fecha,
						});
					}
				});
				
				}else if(this.tipoObjetos == 'retirados'){
					this.lugarService.consultarRetiradosFecha(consulta)
					.then((data) => {
						this.registros = data;
						console.log("consulta retirados-fecha: "+data);
					});

						this.navCtrl.push(ListarRetiradosPage,{ 	 						
							correoLugar: this.correoLugar,
							nombrePunto: this.nombrePunto,
							codigoBusqueda: this.codigoBusqueda,
							registros: this.registros.mensaje ,
				  });
				}
		
		}else if(this.tipoBusqueda == 'consecutivo'){
			 	let consulta = {
					codigoBusqueda: this.codigoBusqueda,
					correoLugar: this.correoLugar,
  			}
			 if(this.tipoObjetos == 'perdidos'){
				 	this.lugarService.consultarPerdidosCodigo(consulta)
					.then((data) => {
							this.registros = data;
							console.log("Resultado consulta: "+data);
					});
				
				//navegar

			 }else if(this.tipoObjetos == 'retirados'){		
		
				this.lugarService.consultarRetiradosCodigo(consulta)
				.then((data) => {
						this.registros = data;
						console.log("Resultado consulta: "+data);
				});
     		//navegar
		
				this.codigoBusqueda = "";
				this.registros=null;
  	 }
		}
	}

	public cambio(){
		console.log(this.puntoRecoleccion);
	}
}