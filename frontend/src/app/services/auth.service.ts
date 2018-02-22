import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { Message }  from '../models/message';

import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
    public token: string;
    private authUrl = 'api-token-auth/';

    constructor(private http: Http, private messageService: MessageService) {
        // set token if saved in local storage
        var currentUser = localStorage.getItem('id_token');
        this.token = currentUser;
        if(isDevMode()) {
          this.authUrl = 'http://127.0.0.1:8000/api-token-auth/'
        }
    }

    login(username: string, password: string): Observable<boolean> {
    	const headers = new Headers({
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		});
		const options = new RequestOptions({
		  headers: headers
		});

        return this.http.post(this.authUrl, JSON.stringify({ username: username, password: password }), options)
        	.map((response: Response) => {
	                // login successful if there's a jwt token in the response
	                let token = response.json() && response.json().token;
	                if (token) {
	                    // set token property
	                    this.token = token;

	                    // store username and jwt token in local storage to keep user logged in between page refreshes
	                    localStorage.setItem('id_token', token);

	                    // return true to indicate successful login
	                    return true;
	                } else {
	                    // return false to indicate failed login
	                    return false;
	                };
            })
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('id_token');
    }

	isAuthenticated(): boolean {
		if (localStorage.getItem('id_token')) {
			return true;
		} else {
			return false;
		};
	}

  private log(text: string, type: string) {
    let now = new Date();
    this.messageService.add({text, type, date: now} as Message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this.log(`${operation} failed: ${error.message}`, 'danger');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}