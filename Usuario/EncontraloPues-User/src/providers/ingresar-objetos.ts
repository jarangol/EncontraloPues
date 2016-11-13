import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the IngresarObjetos provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class IngresarObjetos {
  private data: any;
  private serverURL = 'https://afternoon-crag-97293.herokuapp.com';

  constructor(public http: Http) {
    console.log('Hello IngresarObjetos Provider');
  }

  public insertarObjetos(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.data = this.http.post(this.serverURL + '/api/registrarObjetoPersonal', body,
      { headers: headers }).map(res => res.json());

    return this.data;
    
  }

}
