import{Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';


@Injectable()
export class AService{
	constructor(private http: Http){
	// code...
	}

	getObjeto(id){
		Let objeto = this.http.get(`https://api.github.com/users/${id}`);
		return objeto;
	}

	getRepos(username){
		Let repos = this.http.get(`https://api.github.com/users/${username}/repos`);
		return RegExpConstructor;
	}
}