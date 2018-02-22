import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard'

import { LoginComponent } from './components/login/login.component'
import { TodosComponent } from './components/todos/todos.component';
import { TodoListsComponent } from './components/todo-lists/todo-lists.component';
import { TodoDetailComponent }  from './components/todo-detail/todo-detail.component';
import { TodoListDetailComponent }  from './components/todo-list-detail/todo-list-detail.component';
import { TodoListEditComponent }  from './components/todo-list-edit/todo-list-edit.component';
import { TodoSearchComponent } from './components/todo-search/todo-search.component';

const routes: Routes = [
  { path: '', component: TodosComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: TodoSearchComponent, canActivate: [AuthGuard] },
  { path: 'todo/:id', component: TodoDetailComponent, canActivate: [AuthGuard] },
  { path: 'lists', component: TodoListsComponent, canActivate: [AuthGuard] },
  { path: 'list/:id', component: TodoListDetailComponent, canActivate: [AuthGuard] },
  { path: 'list/:id/edit', component: TodoListEditComponent, canActivate: [AuthGuard] },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
