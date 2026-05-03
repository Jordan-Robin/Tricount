import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pageTitle is a writable signal', () => {
    service.pageTitle.set('Mon titre');
    expect(service.pageTitle()).toBe('Mon titre');
  });

  it('setNotification stores the notification then clears it after 8s', () => {
    vi.useFakeTimers();
    service.setNotification({ message: 'Hello', type: 'success' });
    expect(service.notification()).toEqual({ message: 'Hello', type: 'success' });

    vi.advanceTimersByTime(8000);
    expect(service.notification()).toBeNull();
  });
});
