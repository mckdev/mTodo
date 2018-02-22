import { Component, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { TodosComponent } from '../todos/todos.component';
import { TodoListService } from '../../services/todo-list.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';

import { TodoList } from '../../models/todo-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Todos';
  description = 'Todos app';
  todoLists: TodoList[];

  constructor(private router: Router, private todoListService: TodoListService, private authService: AuthService) {}

  getTodoLists() {
    if (this.isAuthenticated()) {
      this.todoListService.getTodoLists().subscribe(_todoLists => (this.todoLists = _todoLists, 
      this.sortTodoLists()));
    }
  }

  staticUrl(): string {
    if(isDevMode()) {
      return '/assets/'
    }
    return '/static/assets/'
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onShown() {
    this.getTodoLists();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'])
  }



  sortTodoLists() {
    this.todoLists = this.todoLists.sort(this.sortByFields(['completed', 'title']))
  }

  sortByFields(fields) {
    return function (a, b) {
        return fields
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                   dir = -1;
                   o=o.substring(1);
                }
                if (a[o] > b[o]) return dir;
                if (a[o] < b[o]) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue (p,n) {
                return p ? p : n;
            }, 0);
    };
  } 
}
