import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TrabajadoresService {

private data: any;
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    this.data = null;
  }


  /**
   *  Permite hacer una consulta de los objetos perdidos pasandole la fecha
   *  y opcionalmente los tags
  **/
  public consultarPerdidosFecha(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

      return new Promise(resolve => {
       this.data = this.http.post(this.serverURL + '/api/consultarObjetosPerdidosTrabajador', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });
  }
 
 
 /**
   *  Permite hacer una consulta de los objetos perdidos,
   *  pasandole el codigo de registro
   * El usuario debe ser un trabajador
  **/
  public consultarPerdidosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json'); 
      return new Promise(resolve => {
         this.data = this.http.post(this.serverURL + '/api/consultarObjetosPerdidosTrabajadorCodigo', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
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
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
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
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });
  } 

}

