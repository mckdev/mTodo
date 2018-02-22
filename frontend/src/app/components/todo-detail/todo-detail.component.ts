import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable'

import { Todo } from '../../models/todo';
import { TodoList } from '../../models/todo-list';
import { TodoService }  from '../../services/todo.service';
import { TodoListService }  from '../../services/todo-list.service';

@Component({
  selector: 'todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  @Input() todo: Todo;
  todoLists: TodoList[];
  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private todoListService: TodoListService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getTodo();
    this.todoListService.getTodoLists()
      .subscribe(todoLists => this.todoLists = todoLists);
  }

  getTodo(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.todoService.getTodo(id)
      .subscribe(todo => this.todo = todo);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.todoService.updateTodo(this.todo)
      .subscribe(() => this.goBack());
  }

  delete(): void {
    if(confirm('Are you sure to delete this todo?')) {
      this.todoService.deleteTodo(this.todo)
        .subscribe(() => this.goBack());  
      }
  }

  toggleCompleted(): void {
    this.todo.completed = !this.todo.completed
    this.todoService.updateTodo(this.todo).subscribe()
  }  
}
