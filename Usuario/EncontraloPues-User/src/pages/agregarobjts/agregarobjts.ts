import { Component } from '@angular/core';
import { NavController, Platform, Alert,AlertController } from 'ionic-angular';
import { IngresarObjetos } from '../../providers/ingresar-objetos';
import { AuthService } from '../../services/auth/auth.service';


/*
  Generated class for the Agregarobjts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-agregarobjts' ,
  templateUrl: 'agregarobjts.html' ,
  providers: [ IngresarObjetos ] ,
})

export class Agregarobjts {

   tag: any;
   public tags: Array<String>;
   descripcionOculta: string;
   resulConsulta: any;
   correoUsuario: string;
   usuario: any;

  constructor(public navCtrl: NavController,public platform: Platform ,  
              private ingresarService: IngresarObjetos,public auth: AuthService,
              private alertCtrl: AlertController) {
     this.tags = [];
     this.usuario = auth.user;
     this.correoUsuario = this.usuario.email;
     //modificar correoUsuario al correo que me da auth0
  }

  ionViewDidLoad() {
    console.log('Hello Agregarobjts Page');
    console.log(this.correoUsuario);
    
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

  public confirmar(){

    if(this.tags.length > 0){
      
      let registro = {
        tags: this.tags,
        correoUsuario: this.correoUsuario
      };

      this.ingresarService.insertarObjetos(registro).subscribe(data => {
        this.resulConsulta = data;
        console.log(this.resulConsulta);

        if(this.resulConsulta.correcto){
          alert(this.resulConsulta.mensaje);
          console.log(this.resulConsulta.mensaje);
          this.tags = [];
        }else{
          alert(this.resulConsulta.mensaje);
        }

      });

    }else{
      alert("los campos deben de estar completos");
    }
  }

}
