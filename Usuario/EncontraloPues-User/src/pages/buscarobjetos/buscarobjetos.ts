import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Buscarobjetos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-buscarobjetos',
  templateUrl: 'buscarobjetos.html'
})
export class Buscarobjetos {
  tag: any;
  private fecha: any;
  
  public tags: Array<String>;
  constructor(public navCtrl: NavController) {
    this.tags = [];
    var hoy = new Date();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    this.fecha = yyyy+'-'+mm;
  }

  ionViewDidLoad() {
    console.log('Hello Buscarobjetos Page');
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
