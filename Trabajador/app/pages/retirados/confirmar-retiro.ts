import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

//proveedor del service
import { RetirarService } from '../../providers/retirar-service/retirar-service';


@Component({
  templateUrl: 'build/pages/confirmar-retiro/confirmar-retiro.html',
  providers: [RetirarService],
})

export class ConfirmarRetiroPage {

//pertenecen a esta vista
private id: any;
private nombre: any;
private telefono: any;

//me los pasan como navParams desde la vista retirar
private correoLugar: any;
private nombrePunto: any;
private codigoBusqueda: any;
private registro: any;
private correoTrabajador: any;

//pertenecen a registro
private tags:any;
private descripcion: string;
private fecha: any;

  constructor(private navCtrl: NavController, public navParams: NavParams, public retirarService: RetirarService) {
  	
    this.codigoBusqueda = this.navParams.get('codigoBusqueda');
  	this.correoLugar = this.navParams.get('correoLugar');
    this.nombrePunto = this.navParams.get('nombrePunto');
    this.correoTrabajador = this.navParams.get('correoTrabajador');
  }

  confirmar(){
  	if(this.id && this.telefono && this.nombre){
      let retiro={
    		numeroIdPersona: this.id,
    		nombrePersona: this.nombre,
    		celularPersona: this.telefono,

        correoLugar: this.correoLugar ,
        codigoBusqueda:this.codigoBusqueda,
    		correoTrabajador: this.correoTrabajador 
    	};

      this.retirarService.createRetiro(retiro)
        .then((res) => {
          alert(res);
          this.registro = res;
        });

        this.telefono="";
        this.id="";
        this.nombre="";
    }
  	
  }
}
