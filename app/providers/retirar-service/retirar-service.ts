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
    
    return new Promise(resolve => {
    
      this.http.post('http://localhost:8080/api/consultarObjetosPerdidosTrabajador',body, {headers: headers})
        //.map(res => res.json())
        .subscribe(res => {
          this.data = res.text();
          resolve(this.data);
      });
    });  
  }


  public createRetiro(retiro){
    let body = JSON.stringify(retiro);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    // return new Promise(resolve => {
    //   this.http.post("http://localhost:8080/api/registrarObjetoPerdidoQR", body, {headers: headers})
    //     .subscribe(res => {
    //        console.log("createRetiro():"+res.text());
    //        this.data=res.text();
    //        resolve(this.data);
    //    });
    //  });
      
  } 


}

