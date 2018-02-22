import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';


import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Todo } from '../../models/todo';
import { TodoList } from '../../models/todo-list';
import { TodoService } from '../../services/todo.service';
import { TodoListService } from '../../services/todo-list.service';


@Component({
  selector: 'todo-list-detail',
  templateUrl: '../todo-list-detail/todo-list-detail.component.html',
  styleUrls: ['../todos/todos.component.css']
})
export class TodoListDetailComponent implements OnInit {
  todos$: Observable<Todo[]>;
  todos: Todo[];
  todoList$: Observable<TodoList>;
  todoList: TodoList;
  hideCompleted = false;
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private todoListService: TodoListService,
    private location: Location,
    private el: ElementRef) {
  }                                                                                                                                                                                                                                                        

  ngOnInit() {
    this.getTodoList();
    this.getTodos();
  }     

  toggleForm() {
    this.showForm = !this.showForm
    setTimeout(() => {this.focusForm();}, 100);
  }

  focusForm() {
    this.el.nativeElement.querySelector('textarea').focus();
  }

  goBack(): void {
    this.location.back();
  }

  getTodoList(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.todoList$ = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.todoListService.getTodoList(params.get('id')));
    this.todoList$.subscribe(_todoList => this.todoList = _todoList);
  }  

  getTodos(): void {
    this.todos$ = this.route.paramMap.switchMap(
        (params: ParamMap) => this.todoService.getTodos(params.get('id'))
    )
    this.todos$.subscribe(_todos => (this.todos = _todos, this.sortTodos()))
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.addTodo({'title': title, 'todo_list': this.todoList.url} as Todo)
      .subscribe(_todo => (this.todos.push(_todo), this.sortTodos()));
  }

  delete(todo: Todo): void {
    if(confirm('Are you sure to delete this todo?')) {
      this.todos = this.todos.filter(t => t !== todo);
      this.todoService.deleteTodo(todo).subscribe(
        _ => this.sortTodos()
      );
    }
  }

  toggleCompleted(todo: Todo): void {
    todo.completed = !todo.completed;
    this.sortTodos();
    this.todoService.updateTodo(todo).subscribe();
  }

  toggleCompletedVision(): void {
      this.hideCompleted = !this.hideCompleted
  }

  completeTodoList(): void {
    this.todoList.completed = !this.todoList.completed;
    this.todoListService.updateTodoList(this.todoList)
      .subscribe();
  }

  deleteTodoList(): void {
    if(confirm('All todos from this list will be moved to inbox. Are you sure to delete this list?')) {
      this.todoListService.deleteTodoList(this.todoList.id)
        .subscribe(() => this.router.navigate(['/lists']));
    }
  }

  sortTodos() {
    this.todos = this.todos.sort(this.sortByFields(['completed', '-priority', '-id']));
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
