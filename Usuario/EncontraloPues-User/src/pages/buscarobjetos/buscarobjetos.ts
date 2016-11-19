import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Encontrados } from '../encontrados/encontrados';
import { Buscarusuarioprovider } from '../../providers/buscarusuarioprovider';
import { Encontradosconsecutivo } from '../encontradosconsecutivo/encontradosconsecutivo';


/*
  Generated class for the Buscarobjetos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-buscarobjetos',
	templateUrl: 'buscarobjetos.html',
	providers: [Buscarusuarioprovider]
})
export class Buscarobjetos {
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

	constructor(private navCtrl: NavController, private lugarService: Buscarusuarioprovider,
		public alertCtrl: AlertController) {
		//inicializando algunos campos
		this.tags = [];
		this.tipoBusqueda = 'fecha';


		//actualizar fecha a la actual (mes y ano)
		var hoy = new Date();
		var mm = hoy.getMonth() + 1; //hoy es 0!
		var yyyy = hoy.getFullYear();
		this.fecha = yyyy + '-' + mm;

	}

	ionViewLoaded() {
		this.cargarPuntos();
		this.nombrePunto = "Todos";
	}

	/**
	 * Cargar los puntos de recoleccion para consultar 
	 * Segun si son los objetos perdidos o retirados
	 */
	public cargarPuntos() {
		this.lugarService.buscarlugares().subscribe((data) => {
			this.puntosRecoleccion = data.mensaje;
			console.log(data.mensaje);
		});

	}

	public addTag(tagNameInput: any): void {
		if (tagNameInput.value) {
			// Add the tag
			this.tags.push(tagNameInput.value);

			tagNameInput.value = '';
		}
	}

	public deleteTag(tagName: string) {
		let index = this.tags.indexOf(tagName);
		this.tags.splice(index, 1);
	}

	public buscar() {

		

		if(this.tipoBusqueda == 'fecha') {

			let consulta = {
				anoMesRegistro: this.fecha,
				tags: this.tags,
				nombreLugar: this.nombrePunto,
			};

			this.lugarService.consultarPerdidosUsuario(consulta).subscribe((data) => {
				if (data.correcto) {

					this.navCtrl.push(Encontrados, {
						consulta: data.mensaje,
						lugar: this.nombrePunto
					});

				} else {
					alert(data.mensaje);
				}
			});

		}else{

			let consulta = {
				codigoBusqueda: this.codigoBusqueda
			};

			this.lugarService.consultarPerdidosCodigo(consulta).subscribe((data) => {
				if (data.correcto) {
					console.log("busquedad con consecutivo")
					this.navCtrl.push(Encontradosconsecutivo, {
						consulta: data.mensaje
					});

				} else {
					alert(data.mensaje);
				}
			});
		}



	 }

}
