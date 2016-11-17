import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class RetiradosService {

private data: any;
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    this.data = null;
  }



/**
   *  Permite hacer una consulta de los objetos perdidos,
   *  pasandole la fecha y opcionalmente los tags
   * El usuario debe ser un trabajador
  **/
  public consultarRetiradosFecha(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosTrabajador',body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
  }

  /**
   *  Permite hacer una consulta de los objetos perdidos,
   *  pasandole el codigo de registro
   * El usuario debe ser un trabajador
  **/
  public consultarRetiradosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosTrabajadorCodigo',body, {headers: headers})
    .map(res => res.json());
    return this.data;
    
  }



} 


