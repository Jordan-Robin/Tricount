import { Tables } from 'src/types/database.types';

export type Expense = Tables<'expenses'>;

export type ExpenseParticipant = Tables<'expense_participants'>;

export type ExpenseDetail = Omit<Expense, 'created_by' | 'paid_by'> & {
  participants: ExpenseParticipant[];
  created_by: ExpenseParticipant;
  paid_by: ExpenseParticipant;
};
