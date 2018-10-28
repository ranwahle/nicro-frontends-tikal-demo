import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShowComponent } from './search-show.component';

describe('SearchShowComponent', () => {
  let component: SearchShowComponent;
  let fixture: ComponentFixture<SearchShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
