import { Component } from '@angular/core';
import { NavController, NavParams, Alert,AlertController } from 'ionic-angular';
import { ObjetosProvider } from '../../providers/objetos-provider';
import { AuthService } from '../../services/auth/auth.service';


/*
  Generated class for the EliminarObjt page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-eliminar-objt',
  templateUrl: 'eliminar-objt.html',
  providers: [ObjetosProvider],
})
export class EliminarObjt {

  tag: any;
  public tags: Array<String>;
  objeto: any;
  usuario: any;
  resulConsulta: any;



  constructor(public navCtrl: NavController, public navParams: NavParams,
              private objetosProvider: ObjetosProvider, public auth: AuthService, 
              private alertCtrl: AlertController) {
    this.objeto = this.navParams.get('objeto');
    this.tags = this.objeto.objetosPersonales.tags;
    this.usuario = auth.user;
  }

  ionViewDidLoad() {
    console.log('Hello EliminarObjt Page');
    console.log(this.objeto.objetosPersonales.codigoQR);
  }

  public addTag(tagNameInput: any): void {
    if (tagNameInput.value) {
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

  public confirmar() {
    if (this.tags.length > 0) {

      let registro = {
        tags: this.tags,
        correoUsuario: this.usuario.email,
        codigoQR: this.objeto.objetosPersonales.codigoQR
      };

      // console.log(this.tags);
      // console.log(this.usuario.email);
      // console.log(this.tags);
      
      this.objetosProvider.modificarObjeto(registro).subscribe(data => {
        this.resulConsulta = data;

        console.log(this.resulConsulta);

        if (this.resulConsulta.correcto) {
          alert(this.resulConsulta.mensaje);
          console.log(this.resulConsulta.mensaje);
        } else {
          alert(this.resulConsulta.mensaje);
        }

      });
     }else{
          alert("los campos deben de estar completos");       
     }
   }

}
