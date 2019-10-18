import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseMoviesComponent } from './browse-movies.component';

describe('BrowseMoviesComponent', () => {
  let component: BrowseMoviesComponent;
  let fixture: ComponentFixture<BrowseMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseMoviesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
