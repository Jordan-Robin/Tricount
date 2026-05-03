import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { Login } from './login';
import { AuthService } from '@core/services/auth.service';

const authStub = {
  signIn: vi.fn(),
} as unknown as Mocked<AuthService>;

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
    expect(component['form'].invalid).toBe(true);
  });

  it('submit does not call AuthService when form is invalid', async () => {
    await component.submit();
    expect(authStub.signIn).not.toHaveBeenCalled();
  });

  it('submit calls AuthService.signIn with credentials when form is valid', async () => {
    authStub.signIn.mockResolvedValue({ user: null, session: null, error: null } as never);
    component['form'].setValue({ email: 'a@b.c', password: 'pw12345678' });
    await component.submit();
    expect(authStub.signIn).toHaveBeenCalledWith({ email: 'a@b.c', password: 'pw12345678' });
  });
});
