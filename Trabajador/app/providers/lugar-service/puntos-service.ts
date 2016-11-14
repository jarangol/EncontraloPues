import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PuntosService {

private data: any;
private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  
  constructor(private http: Http){
    console.log("puntos service...");
    this.data = null;
  }



/**
   *  Consulta los puntos de recoleccion disponibles de un lugar
   * El usuario debe ser un admin (lugar)
  **/
  public consultarPuntos(consulta) {
     
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data = this.http.post(this.serverURL + '/api/consultarPuntosRecoleccionDisponibles', body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
  }

/**
 * Crear un punto de recoleccion de un lugar   
 *  El usuario debe ser un admin (lugar)
 * 
 **/
  public confirmarPunto(punto) {
    let body = JSON.stringify(punto);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL +'/api/registrarPuntoRecoleccion',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }



/**
 * Crear un punto de recoleccion de un lugar   
 *  El usuario debe ser un admin (lugar)
 * 
 **/
  public crearPunto(punto) {
    let body = JSON.stringify(punto);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL +'/api/registrarNuevoPuntoRecoleccion',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }



/**
 * Eliminar uno de los puntos de recoleccion de un lugar   
 *  El usuario debe ser un admin (lugar)
 * 
 **/
  public eliminarPunto(punto) {
    let body = JSON.stringify(punto);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL +'/api/eliminarPuntoRecoleccion',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }


/**
 * Modificar uno de los puntos de recoleccion de un lugar   
 *  El usuario debe ser un admin (lugar)
 * 
 **/
  public modificarPunto(punto) {
    let body = JSON.stringify(punto);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   
    this.data = this.http.post(this.serverURL + '/api/modificarDatosPuntoRecoleccion',body, {headers: headers})
    .map(res => res.json());

    return this.data;
  }

} 


