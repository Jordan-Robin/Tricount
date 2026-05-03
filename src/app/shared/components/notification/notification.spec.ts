import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { Notification } from './notification';
import { LayoutService } from '@core/services/layout.service';

describe('Notification', () => {
  let component: Notification;
  let fixture: ComponentFixture<Notification>;
  let layout: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notification],
    }).compileComponents();

    fixture = TestBed.createComponent(Notification);
    component = fixture.componentInstance;
    layout = TestBed.inject(LayoutService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders nothing when there is no notification', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('renders the notification message when one is set', async () => {
    layout.setNotification({ message: 'Coucou', type: 'success' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Coucou');
  });
});
