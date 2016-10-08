import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

//proveedor del service
import {Registros} from '../../providers/registros/registros';


@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
})

export class RegistrarPage { 
 private tags: Array<String>;
 descripcion: any;
 codigo: any;
 qr: any;
 tag:any;

   static get parameters() {
     return [[Platform], [NavController]];
	}    
  	
 	constructor(public platform: Platform, public navCtrl: NavController,private registroService: Registros){
        this.codigo='0000100';     
         this.tags = ['tag'];
    }

<<<<<<< HEAD
    scan() {
      this.platform.ready().then(() => {       
  			BarcodeScanner.scan().then((barcodeData) => {
  				 alert(barcodeData.text);
  			}, (err) => {
  			    alert("Ha ocurrido un error: "+err);
  			});   
      });
=======
    scan(): string {
        this.platform.ready().then(() => {       
			BarcodeScanner.scan().then((barcodeData) => {
				 alert(barcodeData.text);
         return barcodeData.text;
			}, (err) => {
			    alert("Ha ocurrido un error: "+err);
			}); 
        });
        return "";
>>>>>>> Julian
    }

    /**
    * Es llamado para confirmar registro manual.
    **/
    confirmar(): void {
      let registro = {
        tags: this.tags,
        descripcion: this.descripcion
      };
      this.registroService.createRegistro(registro);
    }

    /**
    * Método llamado al modificar el toggle de la parte principal.
    **/
    activarQR(){
      if(this.qr){
          let code=this.scan();
       }
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

  alert(){
    alert(this.tag);
  }

}
