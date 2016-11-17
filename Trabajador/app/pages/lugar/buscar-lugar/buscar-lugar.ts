import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

//pagina para resultado de la busqueda
import { ResultadoLugarPage} from '../resultado-lugar/resultado-lugar';

//datos de acceso
import { LogInService } from '../../../providers/logIn-service/logIn-service';

@Component({
  templateUrl: 'build/pages/lugar/buscar-lugar/buscar-lugar.html',
  providers: [LugarService],
})


export class BuscarLugarPage {
  //campos de la interfaz (ngModels)
	private tipoBusqueda: any; //por fecha o consecutivo
	private tipoObjetos: any; //perdidos o retirados
	private nombrePunto: any;	//elegido en un select
	private fecha: any; 
	private tags: any;
	private codigoBusqueda: any; //consecutivo
	
	//lista de los puntosRecoleccion
	private puntosRecoleccion: any;

	//datos necesarios para consultas
	private correoLugar: any;


	private registros: any; //para guardar resultados de consultas.

  constructor(private navCtrl: NavController,private lugarService: LugarService,
  				private login:LogInService) {
  	//inicializando algunos campos
		this.tags = [];
		this.tipoBusqueda = 'fecha';
		this.tipoObjetos = 'perdidos';
	

		//actualizar fecha a la actual (mes y ano)
		var hoy = new Date();
		var mm = hoy.getMonth()+1; //hoy es 0!
		var yyyy = hoy.getFullYear();
		this.fecha = yyyy+'-'+mm;

		this.correoLugar = this.login.getCorreoLugar();
  }

	ionViewLoaded(){
		this.cargarPuntos();
		this.nombrePunto = "Todos";
	}

	/**
	 * Cargar los puntos de recoleccion para consultar 
	 * Segun si son los objetos perdidos o retirados
	 */
	public cargarPuntos(){
		let correo={
		 correoLugar: this.correoLugar
		}

		if(this.tipoObjetos == 'perdidos')
			this.lugarService.consultarPuntosPerdidos(correo)
			.subscribe(data => {
            	this.puntosRecoleccion = data.mensaje;
				console.log(data);
      		});
		else if(this.tipoObjetos == 'retirados')
			this.lugarService.consultarPuntosRetirados(correo)
			.subscribe(data => {
            	this.puntosRecoleccion = data.mensaje;		
				console.log(data);
     		 });
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
  	
		if(this.tipoBusqueda == 'fecha'){ 
			let consulta = {
				anoMesRegistro: this.fecha,
				tags: this.tags,
				nombrePuntoRecoleccion: this.nombrePunto, 
				correoLugar: this.correoLugar,
			}
		
			if(this.tipoObjetos == 'perdidos'){	
				this.lugarService.consultarPerdidosFecha(consulta)
				.subscribe((data) => {
					this.registros = data;
					console.log("fecha perdidos: "+data);
		
					if(this.registros.correcto){
						this.navCtrl.push(ResultadoLugarPage,{ 	 		
							correoLugar: this.correoLugar,
							anoMes: this.fecha,
							registros: this.registros.mensaje ,
							tipoObjetos: this.tipoObjetos
						});
					}else{
						alert(this.registros.mensaje);
					}
				});	

			}else if(this.tipoObjetos == 'retirados'){	
				this.lugarService.consultarRetiradosFecha(consulta)
				.subscribe((data) => {
					this.registros = data;
					console.log("fecha retirados: "+data);
					if(this.registros.correcto){
						this.navCtrl.push(ResultadoLugarPage,{ 	 		
							correoLugar: this.correoLugar,
							anoMes: this.fecha,
							registros: this.registros.mensaje ,
							tipoObjetos: this.tipoObjetos
						});
					}else{
						alert(this.registros.mensaje);
					}
				});
			}	
		}else if(this.tipoBusqueda == 'consecutivo'){ 
			let consulta = {
				codigoBusqueda: this.codigoBusqueda,
				correoLugar: this.correoLugar,
			}

			if(this.tipoObjetos == 'perdidos'){	
				this.lugarService.consultarPerdidosCodigo(consulta)
				.subscribe((data) => {
					this.registros = data;
					console.log("con perdidos: "+data);
				
					if(this.registros.correcto){
						//mostrar aca
					}else{
						alert(this.registros.mensaje);
					}
				});
			}else if(this.tipoObjetos == 'retirados'){			
				this.lugarService.consultarRetiradosCodigo(consulta)
				.subscribe((data) => {
					this.registros = data;
					console.log("con retirados: "+data);
					if(this.registros.correcto){
			     		 //mostrar aca
					}else{
						alert(this.registros.mensaje);
					}
				});
			}	
	 	}
	 }
}
