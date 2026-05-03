import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Session } from '@supabase/supabase-js';

import { ExpenseService } from './expense.service';
import { SupabaseService } from './supabase.service';

const supabaseStub = {
  client: vi.fn(),
  getSession: vi.fn(),
  mapPostgrestError: vi.fn((e) => `mapped:${e.code}`),
} as unknown as Mocked<SupabaseService>;

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: supabaseStub }],
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllExpenses returns the rows for a project', async () => {
    const fakeRows = [{ id: 'e1', label: 'Repas' }];
    const eq = vi.fn().mockResolvedValue({ data: fakeRows, error: null });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    (supabaseStub.client as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ from });

    const result = await service.getAllExpenses('p1');
    expect(from).toHaveBeenCalledWith('expenses');
    expect(eq).toHaveBeenCalledWith('project_id', 'p1');
    expect(result).toEqual({ data: fakeRows, error: null });
  });

  it('createExpense returns "not connected" when no session', async () => {
    supabaseStub.getSession.mockResolvedValue(null);
    const result = await service.createExpense({
      project_id: 'p1',
      label: 'Repas',
      amount: 10,
      expense_date: '2026-05-03',
      paid_by: 'u1',
      participants: ['u1', 'u2'],
    });
    expect(result.error).toBe('Il semble que vous ne soyez pas connectés.');
  });

  it('createExpense inserts the expense then its participants', async () => {
    supabaseStub.getSession.mockResolvedValue({ user: { id: 'creator' } } as Session);

    const single = vi.fn().mockResolvedValue({ data: { id: 'e-new' }, error: null });
    const selectAfterInsert = vi.fn().mockReturnValue({ single });
    const insertExpenses = vi.fn().mockReturnValue({ select: selectAfterInsert });
    const insertParticipants = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === 'expenses') return { insert: insertExpenses };
      if (table === 'expense_participants') return { insert: insertParticipants };
      return {};
    });
    (supabaseStub.client as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ from });

    const result = await service.createExpense({
      project_id: 'p1',
      label: 'Repas',
      amount: 12.5,
      expense_date: '2026-05-03',
      paid_by: 'u1',
      participants: ['u1', 'u2'],
    });

    expect(insertExpenses).toHaveBeenCalledWith(
      expect.objectContaining({
        project_id: 'p1',
        label: 'Repas',
        amount: 12.5,
        paid_by: 'u1',
        created_by: 'creator',
      }),
    );
    expect(insertParticipants).toHaveBeenCalledWith([
      { expense_id: 'e-new', user_id: 'u1' },
      { expense_id: 'e-new', user_id: 'u2' },
    ]);
    expect(result).toEqual({ data: 'e-new', error: null });
  });
});
