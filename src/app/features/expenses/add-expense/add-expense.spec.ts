import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { AddExpense } from './add-expense';
import { ProjectService } from '@core/services/project.service';
import { ExpenseService } from '@core/services/expense.service';

const projectStub = {
  getAllParticipants: vi.fn(),
} as unknown as Mocked<ProjectService>;

const expenseStub = {
  createExpense: vi.fn(),
} as unknown as Mocked<ExpenseService>;

const fakeParticipants = [
  { id: 'pp1', user_id: 'u1', pseudo: 'Jordan' },
  { id: 'pp2', user_id: 'u2', pseudo: 'Alice' },
];

describe('AddExpense', () => {
  let component: AddExpense;
  let fixture: ComponentFixture<AddExpense>;

  beforeEach(async () => {
    vi.clearAllMocks();
    projectStub.getAllParticipants.mockResolvedValue({ data: fakeParticipants, error: null } as never);

    await TestBed.configureTestingModule({
      imports: [AddExpense],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: projectStub },
        { provide: ExpenseService, useValue: expenseStub },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'p1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads project participants and pre-checks them on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(projectStub.getAllParticipants).toHaveBeenCalledWith('p1');
    expect(component['participants']()).toEqual(fakeParticipants);
    expect(component['beneficiaries'].length).toBe(2);
    expect(component['beneficiaries'].value).toEqual([true, true]);
  });

  it('form is invalid when label/amount/paid_by are empty', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component['form'].invalid).toBe(true);
  });

  it('beneficiaries validator fails when no checkbox is checked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component['beneficiaries'].controls.forEach((c) => c.setValue(false));
    expect(component['beneficiaries'].errors).toEqual({ required: true });
  });

  it('submit calls ExpenseService.createExpense with selected beneficiaries', async () => {
    expenseStub.createExpense.mockResolvedValue({ data: 'e-new', error: null });
    fixture.detectChanges();
    await fixture.whenStable();

    component['form'].patchValue({
      label: 'Repas',
      amount: 12.5,
      expense_date: '2026-05-03',
      paid_by: 'u1',
    });
    component['beneficiaries'].controls[1].setValue(false);

    await component.submit();

    expect(expenseStub.createExpense).toHaveBeenCalledWith({
      project_id: 'p1',
      label: 'Repas',
      amount: 12.5,
      expense_date: '2026-05-03',
      paid_by: 'u1',
      participants: ['u1'],
    });
  });
});
