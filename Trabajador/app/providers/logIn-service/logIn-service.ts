import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LogIn provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LogInService {

  private data: any;
  private serverURL = 'https://afternoon-crag-97293.herokuapp.com';
  private correoLugar: any;
  private correoTrabajador:any;
  private puntoTrabajador:any;

  constructor(public http: Http) {
    this.data = null;
    this.puntoTrabajador="b";
  }

  public validarInfo(info) {
    let body = JSON.stringify(info);
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.data = this.http.post(this.serverURL + '/api/iniciarSesionLugarTrabajador', 
    body, {headers : headers})
    .map(res => res.json());

    return this.data;
    
  }

  public getCorreoTrabajador(){
    if(this.correoTrabajador) return this.correoTrabajador;
  }

  public getCorreoLugar(){
    if(this.correoLugar) return this.correoLugar;
  }


  public setCorreoTrabajador(correo){
    this.correoTrabajador = correo;
    console.log("nuevo trabajador "+correo);
  }

  public setCorreoLugar(correo){
    console.log("nuevo lugar "+correo);
    this.correoLugar = correo;
  }

  public getPuntoTrabajador(){
    if(this.puntoTrabajador) return this.puntoTrabajador;
  }


  public setPuntoTrabajador(punto){
    this.puntoTrabajador = punto;
    console.log("nuevo punto "+punto);
  }
}
