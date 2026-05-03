import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import { Expense, ExpenseCreation } from '@shared/models/expense.models';
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private supabase = inject(SupabaseService);

  /**
   * Récupère les dépenses d'un projet.
   *
   * @param projectId UUID du projet.
   *
   * @returns La liste des dépenses du projet, ou une erreur en cas d'échec.
   */
  async getAllExpenses(projectId: string): Promise<ServiceResponse<Expense[]>> {
    try {
      const { data, error } = await this.supabase
        .client()
        .from('expenses')
        .select()
        .eq('project_id', projectId);

      if (error) return { data: null, error: this.supabase.mapPostgrestError(error) };
      return { data: data, error: null };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Crée une dépense et ses bénéficiaires.
   *
   * @param expense Données de la dépense à créer.
   *
   * @returns L'identifiant de la dépense créée, ou une erreur en cas d'échec.
   */
  async createExpense(expense: ExpenseCreation): Promise<ServiceResponse<string>> {
    try {
      const session: Session | null = await this.supabase.getSession();
      if (!session)
        return {
          data: null,
          error: 'Il semble que vous ne soyez pas connectés.',
        };

      const { data: created, error: expenseError } = await this.supabase
        .client()
        .from('expenses')
        .insert({
          project_id: expense.project_id,
          label: expense.label,
          amount: expense.amount,
          expense_date: expense.expense_date,
          paid_by: expense.paid_by,
          created_by: session.user.id,
        })
        .select('id')
        .single();
      if (expenseError)
        return { data: null, error: this.supabase.mapPostgrestError(expenseError) };

      const { error: participantsError } = await this.supabase
        .client()
        .from('expense_participants')
        .insert(
          expense.participants.map((user_id) => ({
            expense_id: created.id,
            user_id,
          })),
        );
      if (participantsError)
        return { data: null, error: this.supabase.mapPostgrestError(participantsError) };

      return { data: created.id, error: null };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }
}
