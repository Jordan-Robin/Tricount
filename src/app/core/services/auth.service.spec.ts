import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { AuthError, Session, User } from '@supabase/supabase-js';

import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

const supabaseStub = {
  getSession: vi.fn(),
  getUser: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
} as unknown as Mocked<SupabaseService>;

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: supabaseStub }],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn returns true when a session exists', async () => {
    supabaseStub.getSession.mockResolvedValue({} as Session);
    expect(await service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn returns false when no session', async () => {
    supabaseStub.getSession.mockResolvedValue(null);
    expect(await service.isLoggedIn()).toBe(false);
  });

  it('signUp returns French error for email_exists', async () => {
    supabaseStub.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: 'email_exists' } as AuthError,
    } as never);

    const result = await service.signUp({ email: 'a@b.c', password: 'pw' });
    expect(result.error).toBe('Un compte existe déjà avec cette adresse e-mail.');
    expect(result.user).toBeNull();
  });

  it('signIn returns the user on success', async () => {
    const fakeUser = { id: 'u1' } as User;
    const fakeSession = { access_token: 'tok' } as Session;
    supabaseStub.signIn.mockResolvedValue({
      data: { user: fakeUser, session: fakeSession },
      error: null,
    } as never);

    const result = await service.signIn({ email: 'a@b.c', password: 'pw' });
    expect(result.error).toBeNull();
    expect(result.user).toBe(fakeUser);
  });
});
