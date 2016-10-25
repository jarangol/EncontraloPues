import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class LugarService {

private data: any;
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    this.data = null;
  }


  /**
  * Get para datos de prueba
  **/
  public consultarPerdidosLugar(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    if (this.data) {
      return Promise.resolve(this.data);
    }
    
    return new Promise(resolve => {
    
      this.http.post(this.serverURL + '/api/consultarObjetosPerdidosLugar',body, {headers: headers})
        .subscribe(res => {
          this.data = res.json();
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
           this.data = res.json();
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
           this.data=res.json();
           resolve(this.data);
       });
     });
      
  } 

}

