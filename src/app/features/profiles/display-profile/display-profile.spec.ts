import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProfile } from './display-profile';

describe('DisplayProfile', () => {
  let component: DisplayProfile;
  let fixture: ComponentFixture<DisplayProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
