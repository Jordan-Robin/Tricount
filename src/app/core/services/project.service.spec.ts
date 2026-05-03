import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Session } from '@supabase/supabase-js';

import { ProjectService } from './project.service';
import { SupabaseService } from './supabase.service';
import { ExpenseService } from './expense.service';

const supabaseStub = {
  client: vi.fn(),
  getSession: vi.fn(),
  mapPostgrestError: vi.fn((e) => `mapped:${e.code}`),
} as unknown as Mocked<SupabaseService>;

const expenseStub = {
  getAllExpenses: vi.fn(),
} as unknown as Mocked<ExpenseService>;

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: supabaseStub },
        { provide: ExpenseService, useValue: expenseStub },
      ],
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('acceptProject returns "not connected" when no session', async () => {
    supabaseStub.getSession.mockResolvedValue(null);
    const error = await service.acceptProject('p1');
    expect(error).toBe('Il semble que vous ne soyez pas connectés.');
  });

  it('createProject calls rpc("add_project") with mapped params', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 'project-id', error: null });
    (supabaseStub.client as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ rpc });

    const result = await service.createProject({
      name: 'Voyage',
      description: null,
      creatorPseudo: 'Jordan',
      participantsEmail: ['a@b.c'],
    });

    expect(rpc).toHaveBeenCalledWith('add_project', {
      p_name: 'Voyage',
      p_description: undefined,
      p_pseudo: 'Jordan',
      p_participants: ['a@b.c'],
    });
    expect(result).toEqual({ data: 'project-id', error: null });
  });

  it('acceptProject updates the participant status', async () => {
    supabaseStub.getSession.mockResolvedValue({
      user: { id: 'u1' },
    } as Session);
    const eqProject = vi.fn().mockResolvedValue({ error: null });
    const eqUser = vi.fn().mockReturnValue({ eq: eqProject });
    const update = vi.fn().mockReturnValue({ eq: eqUser });
    (supabaseStub.client as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({ update }),
    });

    const error = await service.acceptProject('p1');
    expect(error).toBeNull();
    expect(update).toHaveBeenCalledWith({ status: 'accepted' });
  });
});
