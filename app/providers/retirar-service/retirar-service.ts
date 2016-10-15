import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RetirarService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RetirarService {
private data: any;

  constructor(private http: Http){

  }


  /**
  * Get para datos de prueba
  **/
  public consultarCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
     headers.append('Content-Type','application/json');
    if (this.data) {
      return Promise.resolve(this.data);
    }
    //return new Promise(resolve => {
      this.http.post('http://localhost:8080/api/consultarObjetosPerdidosTrabajador',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          console.log("consultarCodigo: "+data);
          //resolve(this.data);
        });
  //  });
  }
  //create retiro 
  

}

