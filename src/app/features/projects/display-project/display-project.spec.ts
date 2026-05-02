import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProject } from './display-project';

describe('DisplayProject', () => {
  let component: DisplayProject;
  let fixture: ComponentFixture<DisplayProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProject],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
