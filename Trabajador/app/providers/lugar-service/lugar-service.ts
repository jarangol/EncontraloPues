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
  * Consultar objetos perdidos por fecha
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
  * Get para datos de prueba
  **/
  public consultarPerdidosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
   
   return new Promise(resolve => {
       this.data=this.http.post(this.serverURL + '/api/consultarObjetosPerdidosLugarCodigo',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     }); 
  }


    /**
  * Get para datos de prueba
  **/
  public consultarRetiradosFecha(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
   
   return new Promise(resolve => {
       this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosLugar',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     }); 
  }

  /**
  * Get para datos de prueba
  **/
  public consultarRetiradosCodigo(consulta) {
    let body = JSON.stringify(consulta);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
   
   return new Promise(resolve => {
       this.data=this.http.post(this.serverURL + '/api/consultarObjetosRetiradosLugarCodigo',body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     }); 
  }

    public consultarPuntosPerdidos(correoLugar){
    
      let body = JSON.stringify(correoLugar);
      let headers = new Headers();
      headers.append('Content-Type','application/json');
    
     return new Promise(resolve => {
      this.data = this.http.post(this.serverURL + '/api/consultarNombrePuntosRecoleccion', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });
        
  }  

      public consultarPuntosRetirados(correoLugar){
    
      let body = JSON.stringify(correoLugar);
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      
      return new Promise(resolve => {
      this.data = this.http.post(this.serverURL + '/api/consultarNombrePuntosRecoleccionDisponibles', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
       });
     });
        
  }  

}

