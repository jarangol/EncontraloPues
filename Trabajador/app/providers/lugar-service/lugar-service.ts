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
  * Consulta objetos perdidos por fecha
  * devolviendo observables
  **/
  public consultarPerdidosFecha(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data = this.http.post(this.serverURL + '/api/consultarObjetosPerdidosLugar',body, {headers: headers})
    .map(res => res.json());
    
    return this.data; 
  }

  /**
  * Consulta objetos perdidos por consecutivo
  **/
  public consultarPerdidosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data=this.http.post(this.serverURL + '/api/consultarObjetosPerdidosLugarCodigo',body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
  }


  /**
  *  Consulta objetos retirados por fecha
  **/
  public consultarRetiradosFecha(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosLugar',body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
  }

  /**
  * Consulta objetos retirados por consecutivo
  */
  public consultarRetiradosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosLugarCodigo',body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
  }





/**
 *  Consulta los puntos de recoleccion  
 * donde hay objetos perdidos registrados
 * @param correoLugar Propietario de los puntos de recoleccion 
 */
 public consultarPuntosPerdidos(correoLugar){    
    let body = JSON.stringify(correoLugar);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
  
    this.data = this.http.post(this.serverURL + '/api/consultarNombrePuntosRecoleccion', body, {headers: headers})
    .map(res => res.json());
    return this.data;  
  }  


/**
 *  Consulta los puntos de recoleccion  
 * donde han sido retirados objetos
 * @param correoLugar Propietario de los puntos de recoleccion 
 */
  public consultarPuntosRetirados(correoLugar){
  
    let body = JSON.stringify(correoLugar);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data = this.http.post(this.serverURL + '/api/consultarNombrePuntosRecoleccionDisponibles', body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
      
  }  




/**  
 * Actualiza datos del lugar
 */
  public modificarLugar(datos){
  
    let body = JSON.stringify(datos);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    this.data = this.http.post(this.serverURL + '', body, {headers: headers})
    .map(res => res.json());
    
    return this.data;
      
  }  

}

