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
   *  Consulta los trabajadores de un lugar
   * El usuario debe ser un admin (lugar)
  **/
  public consultarTrabajadores(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '/api/consultarTrabajadoresDisponibles',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }

  /**
   * Elimina uno de los trabajadores de un lugar
   * El usuario debe ser un admin (lugar)
  **/
  public eliminarTrabajador(trabajador) {
    let body = JSON.stringify(trabajador);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }

  /**
   * Modifica uno de los trabajadores de un lugar
  **/
  public modificarTrabajador(trabajador) {
    let body = JSON.stringify(trabajador);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }

  /**
   * Crea uno de los trabajadores de un lugar
   * El usuario debe ser un admin (lugar)
  **/
  public crearTrabajador(trabajador) {
    let body = JSON.stringify(trabajador);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '/api/registrarNuevoTrabajador',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }


  /**
   * Me confirma si el correo ya esta registrado
   */
  public confirmarTrabajador(correo){    
    let body = JSON.stringify(correo);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '/api/registrarTrabajador',body, {headers: headers})
    .map(res => res.json())
    return this.data;
  }


} 


