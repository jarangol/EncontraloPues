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
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    this.data = null;
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
    
      this.http.post(this.serverURL + '/api/consultarObjetosPerdidosTrabajador',body, {headers: headers})
        .subscribe(res => {
          this.data = res;
          console.log(res);
          resolve(this.data);
      });
    });  
  }

   
  public createRetiro(retiro){
    let body = JSON.stringify(retiro);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return new Promise(resolve => {
      this.http.post(this.serverURL + '/api/retirarObjetoPerdido', body, {headers: headers})
        .subscribe(res => {
           this.data = res.text();
           resolve(this.data);
       });
     });  
  } 


  public createRetiroQR(retiroQR){
    
    let body = JSON.stringify(retiroQR);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return new Promise(resolve => {
      this.http.post(this.serverURL + '/api/retirarObjetoPerdidoQR', body, {headers: headers})
        .subscribe(res => {
           console.log("createRetiro():"+res.text());
           this.data=res.text();
           resolve(this.data);
       });
     });
      
  } 

}

