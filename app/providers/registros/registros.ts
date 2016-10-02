
import { Injectable } from '@angular/core';
import { Http , Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

// emulando servidor

//clase con datos de un registro
import { Registro } from '../../registro'; 

@Injectable()
export class Registros {
	private registrosUrl = 'api/registros';
	data: any;
	
	constructor(private http: Http) {
		this.data=null;
	}

	public getData(): Promise<Registro[]>{
		return this.http.get(this.registrosUrl).toPromise().then(response => response.json().data as Registro[]).catch(this.handleError);	
	}

	private handleError(error: any): Promise<any> {
 		 console.error('An error occurred', error); // for demo purposes only
  		return Promise.reject(error.message || error);
	}

	public getRegistros(){
		console.log("Trayendo registros");

		/*if(this.data){
			return Promise.resolve(this.data);
		}

		return new Promise(resolve => {
			this.http.get('http:localhost:8080/api/registros1')
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			});
		});	*/
	}
		
	createRegistro(registro){
		let body = JSON.stringify({registro});
		let headers = new Headers();
		headers.append('Content-Type','application/json');

		this.http.post('http:localhost:8080/api/registros', body, {headers: headers})
			.subscribe(res => {
				console.log(res.json())
			});
		
	}	

	deleteRegistro(id){
		
		this.http.delete('http://localhost:8080/api/registros/'+id).subscribe((res) => {
    	  console.log(res.json());
    	});
    	
	}
				
}

