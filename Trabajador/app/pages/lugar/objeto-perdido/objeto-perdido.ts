import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,Nav} from 'ionic-angular';

//Servicio de llamados http a consultas con informacion del lugar
import { LugarService} from '../../../providers/lugar-service/lugar-service';

//para actualizar un objeto
import { RegistroService} from '../../../providers/registro-service/registro-service';

//pagina para volver al resultado de la busqueda
import { ResultadoLugarPage} from '../resultado-lugar/resultado-lugar';


@Component({
  templateUrl: 'build/pages/lugar/objeto-perdido/objeto-perdido.html',
  providers: [LugarService,RegistroService],
})
export class ObjetoPerdidoPage {
  //pertenecen a esta clase/vista
  private puntosRecoleccion: any;
  private qr: boolean; //me dice si el objeto es con qr 

  //me los pasan como navParams desde la vista retirar
  private registro: any;  //objeto en detalle
  private correoLugar: any;
  private editando: boolean; //me dice si estoy editando o no el dato
  //pertenecen al registro
  private fecha: any;
  private tags: any;
  private descripcionOculta: string; 
  private nombrePunto: any; //punto actual del objeto
  private nombrePuntoInsertar: any; //punto seleccionado en la interfaz, se cambie o no.

  constructor(private navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController,
              private lugarService: LugarService, private registroService: RegistroService, private nav:Nav) {
      //iniciamos los tags como vacio
      this.tags=[];

      //recibo datos como parametros
        this.registro = this.navParams.get('registro');
        this.correoLugar = this.navParams.get('correoLugar');
        this.editando = this.navParams.get('editar');

     if(this.registro){  
         this.nombrePunto = this.registro.puntosRecoleccion.nombre; 
         this.nombrePuntoInsertar = this.nombrePunto;

         this.registro=this.registro.puntosRecoleccion.objetosPerdidos; //solo para acortar las rutas que siguen
         
         if(this.registro.sinCodigoQR){
           this.descripcionOculta = this.registro.sinCodigoQR.descripcionOculta;
           this.qr=false;
         }else this.qr=true;
    	   
         console.log("qr "+this.qr);   
          this.tags = this.registro.tags;
          let dia = this.registro.fechaRegistro.dia; 
          let añoMes = this.registro.fechaRegistro.anoMes; 
          this.fecha = añoMes + '-' + dia ;

         console.log(this.fecha);   
    }
  }

  public actualizar(){
    let perdido = {
      correoLugar: this.correoLugar,
      nombrePunto:this.nombrePunto,
      codigoBusqueda: this.registro.codigoBusqueda,
      tags: this.tags,
      descripcionOculta: this.descripcionOculta,
      nombrePuntoInsertar: this.nombrePuntoInsertar 
    } 

    this.registroService.actualizarPerdido(perdido)
    .subscribe((data) => {
      alert(data.mensaje);
      if(data.correcto){
        this.navCtrl.popToRoot();
      }else
        alert(data.mensaje);
    });
  }


  ionViewLoaded(){
		this.cargarPuntos();
	}


	/**
	 * Cargar los puntos de recoleccion para consultar 
	 * Segun si son los objetos perdidos o retirados
	 */
	public cargarPuntos(){
		let correo={
		 correoLugar: this.correoLugar
		}

    this.lugarService.consultarPuntosPerdidos(correo)
    .subscribe(data => {
        if(data.correcto)
          this.puntosRecoleccion = data.mensaje;
        console.log("cargando puntos"+data);
    });
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
    // Find the index of the tag
    let index = this.tags.indexOf(tagName);  
    // Delete the tag in that index
    this.tags.splice(index, 1);
  } 


}
