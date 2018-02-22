import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../services/auth.service'
import { MessageService } from '../services/message.service';
import { Message }  from '../models/message';
import { TodoList } from '../models/todo-list';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class TodoListService {

  private todoListsUrl = 'api/lists/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,) {
      if (isDevMode()) {
        this.todoListsUrl = 'http://127.0.0.1:8000/api/lists/';
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

  getTodoLists(): Observable<TodoList[]> {
     const options = {
        headers: new HttpHeaders({ 'Authorization': 'JWT ' + this.authService.token})
      };
  	return this.http.get<TodoList[]>(this.todoListsUrl, this.jwtHeaders())
  	  .pipe(
  	  	tap(todoLists => this.log(`fetched todo lists`, 'info')),
  	  	catchError(this.handleError('getTodoLists', []))
  	  );
  }

  getTodoList(id: any): Observable<TodoList> {
     const options = {
        headers: new HttpHeaders({ 'Authorization': 'JWT ' + this.authService.token})
      };    
    const url = `${this.todoListsUrl}${id}/`;
    return this.http.get<TodoList>(url, this.jwtHeaders()).pipe(
      tap(_ => this.log(`fetched todo list id=${id}`, 'info')),
      catchError(this.handleError<TodoList>(`getTodoList id=${id}`))
    );
  }

  updateTodoList(todoList: TodoList): Observable<any> {
    const id = typeof todoList === 'number' ? todoList : todoList.id;
    const url = `${this.todoListsUrl}${id}/`;

    return this.http.put(url, todoList, this.jwtHeaders()).pipe(
      tap(_ => this.log(`updated todo list id=${todoList.id}`, 'success')),
      catchError(this.handleError<any>('updateTodoList'))
    );
  }  

  addTodoList(todoList: TodoList): Observable<TodoList> {
    return this.http.post<TodoList>(this.todoListsUrl, todoList, this.jwtHeaders()).pipe(
        tap((todoList: TodoList) =>this.log(`added todo list id=${todoList.id}`, 'success')),
        catchError(this.handleError<TodoList>('addTodoList'))
      );
  }

  deleteTodoList(todoList: TodoList | number): Observable<TodoList> {
    const id = typeof todoList === 'number' ? todoList : todoList.id;
    const url = `${this.todoListsUrl}${id}/`;

    return this.http.delete<TodoList>(url, this.jwtHeaders()).pipe(
      tap(_ => this.log(`deleted todo list id=${id}`, 'warning')),
      catchError(this.handleError<TodoList>('deleteTodoList'))
    );  
  }

  private log(text: string, type: string) {
    let now = new Date();
    this.messageService.add({text, type, date: now} as Message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
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
