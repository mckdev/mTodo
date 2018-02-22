import { Component, OnInit, ElementRef } from '@angular/core';

import { TodoListService } from '../../services/todo-list.service'
import { TodoList } from '../../models/todo-list';
import { AppComponent } from '../app/app.component'


@Component({
  selector: 'todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['../todos/todos.component.css', './todo-lists.component.css']
})
export class TodoListsComponent implements OnInit {
  todoLists: TodoList[];
  hideCompleted = false;
  showForm = false;

  constructor(
  	private todoListService: TodoListService,
    private el: ElementRef) { }
  
  ngOnInit() {
    this.getTodoLists();
  }

  toggleForm() {
    this.showForm = !this.showForm
    setTimeout(() => {this.focusForm();}, 100);
  }

  focusForm() {
    this.el.nativeElement.querySelector('textarea').focus();
  }

  getTodoLists(): void {
    this.todoListService.getTodoLists()
      .subscribe(todoLists => (
        this.todoLists = todoLists,
        this.sortTodoLists()
      ));
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoListService.addTodoList({ title } as TodoList)
      .subscribe(todoList => (this.todoLists.push(todoList), this.sortTodoLists()));
  }

  delete(todoList: TodoList): void {
    if(confirm('Are you sure to delete this list?')) {
      this.todoLists = this.todoLists.filter(t => t !== todoList);      
      this.todoListService.deleteTodoList(todoList)
        .subscribe();
      }
  }

  toggleCompleted(todoList: TodoList): void {
    todoList.completed = !todoList.completed
    this.sortTodoLists();
    this.todoListService.updateTodoList(todoList).subscribe()
  }

  toggleCompletedVision(): void {
      this.hideCompleted = !this.hideCompleted
  }  


  sortTodoLists() {
    this.todoLists = this.todoLists.sort(this.sortByFields(['completed', 'title']));
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
