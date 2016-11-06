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
   *  Permite hacer una consulta de los trabajadores 
   *  y opcionalmente los tags
  **/
  public consultarTrabajadores(correoLugar) {
    let body = JSON.stringify(correoLugar);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

      return new Promise(resolve => {
       this.data = this.http.post(this.serverURL + '/api/consultarTrabajadoresDisponibles', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });
  }
 
 

}

