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


  public createRegistroQR(registroQR){
    let body = JSON.stringify(registroQR);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

      return new Promise(resolve => {
        this.data=this.http.post(this.serverURL + '/api/registrarObjetoPerdidoQR',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });      
  }

  public createRegistro(registro){
    let body = JSON.stringify(registro);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    console.log("lo llama");
    
    return new Promise(resolve => {
        this.http.post(this.serverURL + '/api/registrarObjetoPerdido',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          console.log(this.data.mensaje);
          resolve(this.data);
       });
     });

  }  

  public actualizarPerdido(perdido){
      let body = JSON.stringify(perdido);
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      
      this.data = this.http.post(this.serverURL+'/api/modificarDatosObjetoPerdido' , body, {headers: headers})
      .map(res => res.json());
      
      return this.data;
  }


  public borrarPerdido(perdido){
      let body = JSON.stringify(perdido);
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      
      this.data = this.http.post(this.serverURL+'/api/eliminarObjetoPerdido' , body, {headers: headers})
      .map(res => res.json());
      
      return this.data;
  }



}

