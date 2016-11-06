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
   *  Consulta objetos perdidos 
   * en un mes y año especifico
   * 
  **/
  public consultarPerdidosFecha(consulta) {
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



  /**
   * 
   * consulta un objeto perdido en especifico
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
   *  Permite hacer una consulta de los objetos perdidos,
   *  pasandole la fecha y opcionalmente los tags
   * El usuario debe ser un trabajador
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
   *  Permite hacer una consulta de los objetos perdidos,
   *  pasandole el codigo de registro
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

  /**
   * La diferencia es que aca  pueden 
   */
    public consultarPuntosPerdidos(correoLugar){
    
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

    public consultarPuntosRetirados(correoLugar){
    
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


}

