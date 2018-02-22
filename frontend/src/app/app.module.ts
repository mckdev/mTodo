import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { AuthGuard } from './guards/auth.guard'
import { AuthService } from './services/auth.service'

import { AppComponent } from './components/app/app.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { TodoService } from './services/todo.service';
import { TodoListService } from './services/todo-list.service';
import { MessagesComponent } from './components/messages/messages.component';
import { MessageService } from './services/message.service';
import { AppRoutingModule } from './app-routing.module';
import { TodoSearchComponent } from './components/todo-search/todo-search.component';
import { TodoListsComponent } from './components/todo-lists/todo-lists.component';
import { TodoListDetailComponent } from './components/todo-list-detail/todo-list-detail.component';
import { TodoListEditComponent } from './components/todo-list-edit/todo-list-edit.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    TodoDetailComponent,
    MessagesComponent,
    TodoSearchComponent,
    TodoListsComponent,
    TodoListDetailComponent,
    TodoListEditComponent,
    LoginComponent
  ],
  imports: [
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
	  FormsModule,
	  AppRoutingModule,
    HttpModule,
    HttpClientModule,
    MatSelectModule,
    MatInputModule,
  ],
  providers: [AuthGuard, AuthService, TodoService, TodoListService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
