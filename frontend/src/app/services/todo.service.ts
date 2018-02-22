import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../services/auth.service'
import { MessageService } from './message.service';
import { Todo } from '../models/todo';
import { Message }  from '../models/message';

import { AppComponent } from '../components/app/app.component'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TodoService {
  private todosUrl = 'api/todos/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,) {
      if(isDevMode()) {
        this.todosUrl = 'http://127.0.0.1:8000/api/todos/';
      }
    }

  jwtHeaders(): object {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.authService.token,
      })
    };
    return options;
  }

  getTodos(id?: any): Observable<Todo[]> {
    let url: string;
    if(id) {
      url = `${this.todosUrl}?todo_list=${id}`
    } else {
      url = `${this.todosUrl}?inbox`
    }
    return this.http.get<Todo[]>(url, this.jwtHeaders())
      .pipe(
        tap(todos => this.log(`fetched todos`, 'info')),
        catchError(this.handleError('getTodos', [])),
      );
  }

  getTodo(id: number): Observable<Todo> {
    const url = `${this.todosUrl}${id}/`;
    return this.http.get<Todo>(url, this.jwtHeaders()).pipe(
      tap(_ => this.log(`fetched todo id=${id}`, 'info')),
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const url = `${this.todosUrl}${id}/`;

    return this.http.put(url, todo, this.jwtHeaders()).pipe(
      tap(_ => this.log(`updated todo id=${todo.id}`, 'success')),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, todo, this.jwtHeaders()).pipe(
        tap((todo: Todo) => this.log(`added todo id=${todo.id}`, 'success')),
        catchError(this.handleError<Todo>('addTodo'))
      );
  }

  deleteTodo(todo: Todo | number): Observable<Todo> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const url = `${this.todosUrl}${id}/`;

    return this.http.delete<Todo>(url, this.jwtHeaders()).pipe(
      tap(_ => this.log(`deleted todo id=${id}`, 'warning')),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  searchTodos(term: string): Observable<Todo[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Todo[]>(
      `${this.todosUrl}?search=${term}`, this.jwtHeaders()).pipe(
        tap(_ => this.log(`searched todos matching "${term}"`, 'info')),
        catchError(this.handleError<Todo[]>('searchTodos', []))
      );
  }

  private log(text: string, type: string) {
    let now = new Date();
    this.messageService.add({text, type, date: now} as Message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      this.log(`${operation} failed: ${error.message}`, 'danger');
      
      if (error.message.includes('Unauthorized')) {
        this.router.navigate(['/login'])
        this.messageService.clear()
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
