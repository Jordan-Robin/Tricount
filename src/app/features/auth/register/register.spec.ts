import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { Register } from './register';
import { AuthService } from '@core/services/auth.service';

const authStub = {
  signUp: vi.fn(),
} as unknown as Mocked<AuthService>;

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when password is shorter than 8 chars', () => {
    component['form'].setValue({ email: 'a@b.c', password: 'short' });
    expect(component['form'].invalid).toBe(true);
  });

  it('submit calls AuthService.signUp when form is valid', async () => {
    authStub.signUp.mockResolvedValue({ user: null, error: null } as never);
    component['form'].setValue({ email: 'a@b.c', password: '12345678' });
    await component.submit();
    expect(authStub.signUp).toHaveBeenCalledWith({ email: 'a@b.c', password: '12345678' });
  });
});
