import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import { Expense } from '@shared/models/expense.models';

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
}
