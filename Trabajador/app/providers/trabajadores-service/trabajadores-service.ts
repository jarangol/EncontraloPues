import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TrabajadoresService {

private data: any;
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    console.log("trabajadores service...");
    this.data = null;
  }



/**
   *  Permite hacer una consulta de los trabajadores de un lugar
   * El usuario debe ser un admin (lugar)
  **/
  public consultarTrabajadores(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '/api/consultarObjetosRetiradosTrabajador',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }



} 


