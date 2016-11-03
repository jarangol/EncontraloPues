import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LogIn provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LogInService {

  private data: any;
  private serverURL = 'https://afternoon-crag-97293.herokuapp.com';

  constructor(public http: Http) {
    console.log('Hello LogIn Provider');
    this.data = null;
  }

  public validarInfo(info) {

    console.log('llame a validar info');

    let body = JSON.stringify(info);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    return new Promise(resolve =>{
      this.http.post(this.serverURL + '/api/iniciarSesion', body, {headers : headers})
      .subscribe(res => {
        this.data = res.json();
        resolve(this.data);
      });
    });
  }

}
