import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { User } from '@supabase/supabase-js';

import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

const authStub = {
  getUser: vi.fn(),
} as unknown as Mocked<AuthService>;

const supabaseStub = {
  client: vi.fn(),
  mapPostgrestError: vi.fn(),
} as unknown as Mocked<SupabaseService>;

function buildSelectChain(result: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  return { from };
}

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns the auth error when no user is connected', async () => {
    authStub.getUser.mockResolvedValue({ data: null, error: 'Non connecté' });
    const result = await service.getCurrentUserProfile();
    expect(result.data).toBeNull();
    expect(result.error).toBe('Non connecté');
  });

  it('returns the profile when found', async () => {
    const fakeProfile = { id: 'p1', user_id: 'u1', first_name: 'Jordan' };
    authStub.getUser.mockResolvedValue({ data: { id: 'u1' } as User, error: null });
    (supabaseStub.client as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      buildSelectChain({ data: fakeProfile, error: null }),
    );

    const result = await service.getCurrentUserProfile();
    expect(result.error).toBeNull();
    expect(result.data).toEqual(fakeProfile);
  });
});
