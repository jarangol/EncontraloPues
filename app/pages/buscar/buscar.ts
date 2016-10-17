import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
 
/*
  Generated class for the BuscarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/buscar/buscar.html',
})
export class BuscarPage {
	private tags: any;
	private codigoBusqueda: any;
	private añoRegistro: any;
  private mesRegistro: any;
  
  constructor(private navCtrl: NavController) {
  	this.tags = [];
  }


  public addTag(tagNameInput: any): void {
    if(tagNameInput.value) {
      // Add the tag
      this.tags.push(tagNameInput.value);
      
      // Reset the field
      tagNameInput.value = '';
    }
  }
  
  public deleteTag(tagName: string) {
    // Find the index of the tag
    let index = this.tags.indexOf(tagName);  
    // Delete the tag in that index
    this.tags.splice(index, 1);
  } 

  public buscar(){
  	let busqueda={
  		añoRegistro: this.añoRegistro,
      mesRegistro: this.mesRegistro,
  		codigoObjeto: this.codigoBusqueda,
  		tags: this.tags
  	};
  	//this.busquedaService.buscar(busqueda);
  }

}
