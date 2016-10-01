import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Registros provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Registros {
	
	data: any;
	
	constructor(private http: Http) {
		this.data=null;
	}

	getData(){
		return "getData";
	}

	getRegistros(){
		let registro1= {
	        tags: 'tags1',
	        descripcion: 'descripcion1'
	     };

      let registro2 = {
        tags: 'tags2',
        descripcion: 'descripcion2'
      };

      return this.data = {registro1, registro2};


		/*
		if(this.data){
			return Promise.resolve(this.data);
		}

		return new Promise(resolve => {
			this.http.get('http:localhost:8080/api/registros')
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			});
		});
		*/
	}
		
	createRegistro(registro){
		/*
		let headers = new Headers();
		headers.append('Content-Type','application/json');

		this.http.post('http:localhost:8080/api/registros', JSON.stringify(registro), {headers: headers})
			.subscribe(res => {
				console.log(res.json())
			});
			*/
	}	

	deleteReview(id){
		/*
		this.http.delete('http://localhost:8080/api/registros/'+id).subscribe((res) => {
    	  console.log(res.json());
    	});
    	*/
	}
				
}

