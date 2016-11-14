import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Qrnotificator provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Qrnotificator {
  private data: any;
  private serverURL = 'https://afternoon-crag-97293.herokuapp.com';

  constructor(public http: Http) {
    this.data = null
    console.log('Hello Qrnotificator Provider');
  }

  public notificarQr(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.data = this.http.post(this.serverURL + '/api/notificacionUsuario_Usuario', body,
      { headers: headers }).map(res => res.json());

    return this.data;
  }

}
