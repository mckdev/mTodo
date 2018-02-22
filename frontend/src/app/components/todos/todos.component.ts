import { Component, OnInit, ElementRef } from '@angular/core';

import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';


@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[];
  hideCompleted = false;
  showForm = false;

  constructor(
    private todoService: TodoService,
    private el: ElementRef) {
  }

  ngOnInit() {
    this.getTodos();
  }

  toggleForm() {
    this.showForm = !this.showForm
    setTimeout(() => {this.focusForm();}, 100);
  }

  focusForm() {
    this.el.nativeElement.querySelector('textarea').focus();
  }
  
  getTodos(): void {
    this.todoService.getTodos()
      .subscribe(
        todos => (this.todos = todos, this.sortTodos())
      );
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.addTodo({ title } as Todo)
      .subscribe(
        todo => (this.todos.push(todo), this.sortTodos()),
      );
  }

  toggleCompleted(todo: Todo): void {
    todo.completed = !todo.completed
    this.sortTodos();
    this.todoService.updateTodo(todo).subscribe()
  }

  toggleCompletedVision(): void {
      this.hideCompleted = !this.hideCompleted
  }

  delete(todo: Todo): void {
    if(confirm('Are you sure to delete this todo?')) {
      this.todos = this.todos.filter(t => t !== todo);
      this.todoService.deleteTodo(todo).subscribe();
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
