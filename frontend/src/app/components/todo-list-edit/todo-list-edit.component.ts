import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable'

import { TodoList } from '../../models/todo-list';
import { TodoListService }  from '../../services/todo-list.service';

@Component({
  selector: 'app-todo-list-edit',
  templateUrl: './todo-list-edit.component.html',
  styleUrls: ['./todo-list-edit.component.css']
})
export class TodoListEditComponent implements OnInit {

  @Input() todoList: TodoList;
  constructor(
    private route: ActivatedRoute,
    private todoListService: TodoListService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getTodoList();
  }

  getTodoList(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.todoListService.getTodoList(id)
      .subscribe(todoList => this.todoList = todoList);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.todoListService.updateTodoList(this.todoList)
      .subscribe(() => this.goBack());
  }  

  delete(): void {
    if(confirm('Are you sure to delete this todo?')) {
      this.todoListService.deleteTodoList(this.todoList)
        .subscribe(() => this.goBack());  
      }
  }

  toggleCompleted(): void {
    this.todoList.completed = !this.todoList.completed
    this.todoListService.updateTodoList(this.todoList).subscribe()
  }
}
