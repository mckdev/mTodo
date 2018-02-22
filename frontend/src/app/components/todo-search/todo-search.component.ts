import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import {
	debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'todo-search',
  templateUrl: './todo-search.component.html',
  styleUrls: ['./todo-search.component.css']
})
export class TodoSearchComponent implements OnInit {
  todos$: Observable<Todo[]>;
  private searchTerms = new Subject<string>();

  constructor(private todoService: TodoService) {}
  
  search(term: string): void {
  	this.searchTerms.next(term);
  }

  ngOnInit(): void {
  	this.todos$ = this.searchTerms.pipe(
  	  debounceTime(300),
  	  distinctUntilChanged(),
  	  switchMap((term: string) => this.todoService.searchTodos(term)),
	);
  }
}
