import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import { Project, INVITATION_STATUS } from '@shared/models/project.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);

  /**
   * Récupère tous les projets dont l'utilisateur connecté participe.
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

  /**
   * Récupère tous les projets en attente de validation de l'utilisateur connecté.
   *
   * @returns La liste des projets non validés, ou une erreur en cas d'échec.
   */
  async getPendingUserProjects(): Promise<ServiceResponse<Project[]>> {
    try {
      const { data, error } = await this.authService.getUser();
      if (!data) return { data: null, error: error as string };

      const userId: string = data.id;
      const { data: projectsList, error: projectError } = await this.supabase
        .client()
        .from('projects')
        .select('*, project_participants!inner()')
        .eq('project_participants.user_id', userId)
        .eq('project_participants.status', INVITATION_STATUS.PENDING);
      if (projectsList) return { data: projectsList, error: null };
      return { data: null, error: this.supabase.mapPostgrestError(projectError) };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }
}
