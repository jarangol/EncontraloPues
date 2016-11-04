import { Component } from '@angular/core';
import { NavController,Page, Platform, Alert} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {BarcodeScanner} from 'ionic-native';

//proveedor del service
import { RegistroService} from '../../../providers/registro-service/registro-service';

@Component({
  templateUrl: 'build/pages/trabajador/registrar/registrar.html',
  //providers: [RegistroService]
})

export class RegistrarPage { 
 //atributos específicos de la vista
 private tag: any;//tag para agregar
 private codigoQR: string; //string scaneada desde el codigo qr
 private tags: Array<String>; //guarda el conjunto de tags
 private descripcionOculta: string;
 private tipoRegistro: any; //Indica si el registro es manual o por qr.

 private registro: any; //aloja el resultado del llamado al servidor
 
 //datos proporcionados en la autenticación 
 private correoLugar: string;
 private nombrePunto: string;
 private  correoTrabajador: string;

 	constructor(public platform: Platform, private navCtrl: NavController,public registroService: RegistroService){   
         this.tipoRegistro = 'manual'; //hace el tab de manual por defecto
         this.tags = []; //para inicializar el arreglo de tags

         //datos necesarios
         this.correoLugar="Eafit@";
         this.nombrePunto="b";
         this.correoTrabajador="m";
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
        .then(data => {
            this.registro = data;
            console.log(this.registro);
        });

        if(this.registro){
          alert(this.registro.mensaje);
          console.log(this.registro.mensaje);
          this.tags = [];
          this.descripcionOculta="";
        }else{
          alert(this.registro.mensaje);
        }
      }
    }

    /**
    * Método llamado para hacer un registro escaneando el codigo QR
    **/
    public activarQR(){   

      this.platform.ready().then(() => {       
          BarcodeScanner.scan().then((barcodeData) => {
            
            let registroQR = {
              codigoQR: barcodeData.text,
              correoLugar: this.correoLugar,
              nombrePunto: this.nombrePunto,
              correoTrabajador: this.correoTrabajador
            };

            this.registroService.createRegistroQR(registroQR)
            .then(data => {
              this.registro = data;
            });
          
            alert(this.registro.mensaje);

        }, (err) => {
            alert("Ha ocurrido un error: "+err);
        }); 
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
