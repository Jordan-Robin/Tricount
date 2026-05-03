import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { AppLayout } from './app-layout';
import { AuthService } from '@core/services/auth.service';

const authStub = {
  signOut: vi.fn(),
} as unknown as Mocked<AuthService>;

describe('AppLayout', () => {
  let component: AppLayout;
  let fixture: ComponentFixture<AppLayout>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [AppLayout],
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('signOut calls AuthService and navigates to /login', async () => {
    authStub.signOut.mockResolvedValue(undefined);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await component.signOut();

    expect(authStub.signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['login']);
  });
});
