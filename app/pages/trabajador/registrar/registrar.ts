import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

//proveedor del service
import { RegistroService} from '../../../providers/registro-service/registro-service';

@Component({
  templateUrl: 'build/pages/registrar/registrar.html',
  providers: [RegistroService]
})

export class RegistrarPage { 
 tag: any;//tag para agregar
 qrToggle: any; //toggle tag
 codigoBusqueda: any; //retornado al hacer el registro
 registro: any;

 codigoQR: string;
 correoLugar: string;
 nombrePunto: string;
 correoTrabajador: string;

 private tags: Array<String>;
 descripcionOculta: string;
 codigo: any;

 	constructor(public platform: Platform, private navCtrl: NavController,public registroService: RegistroService){   
         this.tags = [];

         //ejemplo de registro con QR
         this.correoLugar="Eafit@";
         this.nombrePunto="c";
         this.correoTrabajador="m";
         this.codigoQR="57f4bc2305ce30bc346183b0";

         //this.registroQR= new RegistroQR(this.codigoQR,this.correoLugar,this.nombrePunto,this.correoTrabajador);
    }


   public scan(): string {
        this.platform.ready().then(() => {       
			   BarcodeScanner.scan().then((barcodeData) => {
				 alert("scan");
         alert(barcodeData.text);
         this.codigoQR=barcodeData.text;
         return barcodeData.text;
			}, (err) => {
			    alert("Ha ocurrido un error: "+err);
			}); 
        });
        return "";
    }

    /**
    * Es llamado para confirmar registro manual.
    **/
    public confirmar(){
      if(this.descripcionOculta && this.tags.length > 0){ 
        let registro = {
          tags: this.tags,
          descripcionOculta: this.descripcionOculta,
          correoLugar: this.correoLugar,
          nombrePunto: this.nombrePunto,
          correoTrabajador: this.correoTrabajador
        };
        this.registroService.createRegistro(registro)
        .then((res) => {
          alert(res);
          this.registro = res;
        });

        this.tags = [];
        this.descripcionOculta="";
      }
    }

    /**
    * Método llamado al modificar el toggle de la parte principal.
    **/
    public activarQR(): void{   
      
      if(this.qrToggle){
        this.platform.ready().then(() => {       
           BarcodeScanner.scan().then((barcodeData) => {
             
              let registroQR = {
                codigoQR: barcodeData.text,
                correoLugar: this.correoLugar,
                nombrePunto: this.nombrePunto,
                correoTrabajador: this.correoTrabajador
              };

              this.registroService.createRegistroQR(registroQR)
               .then((res) => {
                alert(res);
                this.registro = res;
              });

          }, (err) => {
              alert("Ha ocurrido un error: "+err);
          }); 
        });        
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

}
