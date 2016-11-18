import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

//Servicio de llamados http 
import { LugarService} from '../../../providers/lugar-service/lugar-service';

//pagina para resultado de la busqueda
import { ResultadoLugarPage} from '../resultado-lugar/resultado-lugar';

//datos de acceso
import { LogInService } from '../../../providers/logIn-service/logIn-service';

import { ObjetoPerdidoPage} from '../objeto-perdido/objeto-perdido';

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
  				private login:LogInService,public alertCtrl: AlertController) {
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
		
					if(data.correcto){
						this.navCtrl.push(ResultadoLugarPage,{ 	 		
							registros: data.mensaje ,
							tipoObjetos: this.tipoObjetos,
							consulta: consulta
						});
					}else{
						alert(data.mensaje);
					}
				});	

			}else if(this.tipoObjetos == 'retirados'){	
				this.lugarService.consultarRetiradosFecha(consulta)
				.subscribe((data) => {
					console.log("fecha retirados: "+data);
					if(data.correcto){
						this.navCtrl.push(ResultadoLugarPage,{ 	 		
							correoLugar: this.correoLugar,
							anoMes: this.fecha,
							registros: data.mensaje ,
							tipoObjetos: this.tipoObjetos
						});
					}else{
						alert(data.mensaje);
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
					console.log("con perdidos: "+data);
				
					if(data.correcto){
						//mostrar aca
					}else{
						alert(data.mensaje);
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



// 	    /**
//     * Busca un objeto perdido por su consecutivo
//     */
//    public buscarConsecutivo() {
//     let prompt = this.alertCtrl.create({
//       title: 'Buscar consecutivo',
//       message: "Ingrese el consecutivo completo del objeto perdido.",
//       inputs: [
//         {
//           name: 'consecutivo',
//           placeholder: 'Consecutivo',
// 					type: 'text',
//         },
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           handler: data => {
//           //this.tipoBusqueda = "fecha";

//           }
//         },
//         {
//           text: 'Buscar',
//           handler: data => {
//             let consulta = {
// 							codigoBusqueda: data.consecutivo,
// 							correoLugar: this.correoLugar,
// 						}
// 					console.log(data.consecutivo);
// 					console.log(this.correoLugar);

// 			this.lugarService.consultarPerdidosCodigo(consulta)
// 			.subscribe(data => {
// 					if(data.correcto){										
// 						prompt.dismiss().then(() => {
// 						this.navCtrl.push(DetalleRetiroPage,{ 	 					
// 							correoLugar: this.correoLugar,
// 							nombrePunto: this.nombrePunto,
// 							registro: data.mensaje, 
// 							correoTrabajador: this.correoTrabajador
// 						}); 
							
// 			}); 
// 					}else{
// 						alert(data.mensaje);
// 					}
// 			});
// 			return false;
// }
//         }
//       ]
//     });
//     prompt.present();
//   }

}
