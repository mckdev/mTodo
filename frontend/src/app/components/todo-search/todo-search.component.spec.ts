import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSearchComponent } from './todo-search.component';

describe('TodoSearchComponent', () => {
  let component: TodoSearchComponent;
  let fixture: ComponentFixture<TodoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
