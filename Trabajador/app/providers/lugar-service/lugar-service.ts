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
    
   
   return new Promise(resolve => {
       this.data=this.http.post(this.serverURL + '/api/consultarObjetosPerdidosLugar',body, {headers: headers})
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
        this.data = this.http.post(this.serverURL + '/api/retirarObjetoPerdido', body, {headers: headers})
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
      this.data = this.http.post(this.serverURL + '/api/retirarObjetoPerdidoQR', body, {headers: headers})
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

