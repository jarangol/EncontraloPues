import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Alert} from 'ionic-angular';
// emulando servidor

//clase con datos de un registro
import { RegistroQR } from '../../registroQR'; 

@Injectable()
export class Registros {
	private registrosUrl = 'api/registros';
	data: any;
	
	constructor(private http: Http) {
		this.data=null;
	}

	public getData(): Promise<RegistroQR[]>{
		return this.http.get(this.registrosUrl).toPromise().then(response => response.json().data as RegistroQR[]).catch(this.handleError);	
	}

	private handleError(error: any): Promise<any> {
 		 console.error('An error occurred', error); // for demo purposes only
  		return Promise.reject(error.message || error);
	}

	getRegistros(){
		console.log("Trayendo registros");
		alert("llego al metodo");
		this.http.get('http:localhost:8080/api/registros1');
		/*
		if(this.data){
			return Promise.resolve(this.data);
		}


		
		return new Promise(resolve => {
			this.http.get('http:localhost:8080/api/registros1')})};
			
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			});
		});	*/
	}
		
	createRegistro(registro){
		let body = JSON.stringify(registro);
		let headers = new Headers();
		headers.append('Content-Type','application/json');

		this.http.post('http:localhost:8080/api/registros', body, {headers: headers})
			.subscribe(res => {
				console.log(res.json())
			});
		
	}	

	deleteRegistro(id){
		alert("llego al metodo delete en el provider");
		this.http.delete('http://localhost:8080/api/registros/'+id).subscribe((res) => {
    	  console.log(res.json());
    	});
    	
	}
	
	load(){}			
}

