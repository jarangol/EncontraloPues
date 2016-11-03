import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';

import 'rxjs/add/operator/map';

/*
  Generated class for the RegistroService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RegistroService {
	
  private data: any;
  private serverURL = 'https://afternoon-crag-97293.herokuapp.com';

  constructor(private http: Http) {
    this.data = null;
  }


  /**
  * Get para datos de prueba
  **/
  public load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.serverURL + '/api/prueba')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });

  }

  public createRegistroQR(registroQR){
    let body = JSON.stringify(registroQR);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return new Promise(resolve => {
      this.http.post(this.serverURL + '/api/registrarObjetoPerdidoQR', body, {headers: headers})
        .subscribe(res => {
           console.log("createRegistroQR():"+res.text());
           this.data=res.json();
           resolve(this.data);
       });
     });
      
  }

  public createRegistro(registro){
    let body = JSON.stringify(registro);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return new Promise(resolve => {
      this.http.post('https://afternoon-crag-97293.herokuapp.com/api/registrarObjetoPerdido', body, {headers: headers})
        .subscribe(res => {
           this.data = res.json();
           resolve(this.data);
        });
     
     });
  }  


}

