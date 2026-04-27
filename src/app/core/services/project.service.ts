import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import { Project } from '@shared/models/project.models';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private supabase = inject(SupabaseService);

  /**
   * Récupère en base tous les projets dont l'utilisateur connecté participe.
   *
   * @returns Une liste de projets, ou une erreur en cas d'échec.
   */
  async getAll(): Promise<ServiceResponse<Project[]>> {
    try {
      const { data, error } = await this.supabase.client().from('projects').select();

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
