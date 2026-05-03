import { Tables } from 'src/types/database.types';

export type Expense = Tables<'expenses'>;

export type ExpenseParticipant = Tables<'expense_participants'>;

export type ExpenseDetail = Omit<Expense, 'created_by' | 'paid_by'> & {
  participants: ExpenseParticipant[];
  created_by: ExpenseParticipant;
  paid_by: ExpenseParticipant;
};

export type ExpenseCreation = {
  project_id: string;
  label: string;
  amount: number;
  expense_date: string;
  paid_by: string;
  participants: string[];
};
