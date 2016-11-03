import { Component } from '@angular/core';
import { NavController, Platform, Alert } from 'ionic-angular';

/*
  Generated class for the Agregarobjts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-agregarobjts',
  templateUrl: 'agregarobjts.html'
})
export class Agregarobjts {

   tag: any;
   private tags: Array<String>;

  constructor(public navCtrl: NavController,public platform: Platform) {
     this.tags = [];
  }

  ionViewDidLoad() {
    console.log('Hello Agregarobjts Page');
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
