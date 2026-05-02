import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import {
  Project,
  INVITATION_STATUS,
  ProjectCreation,
  ProjectDetail,
} from '@shared/models/project.models';
import { Session } from '@supabase/supabase-js';
import { ProjectParticipant } from '@shared/models/project.models';
import { ExpenseService } from './expense.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private supabase = inject(SupabaseService);
  private expenseService = inject(ExpenseService);

  /**
   * Récupère tous les projets dont l'utilisateur connecté participe.
   *
   * @returns Une liste de projets, ou une erreur en cas d'échec.
   */
  async getAll(): Promise<ServiceResponse<Project[]>> {
    try {
      const session: Session | null = await this.supabase.getSession();
      if (!session)
        return {
          data: null,
          error: 'Il semble que vous ne soyez pas connectés.',
        };

      const { data, error } = await this.supabase
        .client()
        .from('projects')
        .select('*, project_participants!inner()')
        .eq('project_participants.user_id', session.user.id)
        .eq('project_participants.status', INVITATION_STATUS.ACCEPTED);
      if (data) return { data: data, error: null };
      return { data: null, error: this.supabase.mapPostgrestError(error) };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Retourne un projet par son identifiant.
   *
   * @param projectId UUID du projet.
   *
   * @returns Projet, ou une erreur en cas d'échec.
   */
  async getProjectById(projectId: string): Promise<ServiceResponse<Project>> {
    try {
      const { data, error } = await this.supabase
        .client()
        .from('projects')
        .select()
        .eq('id', projectId)
        .single();
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
      const session: Session | null = await this.supabase.getSession();
      if (!session)
        return {
          data: null,
          error: 'Il semble que vous ne soyez pas connectés.',
        };

      const { data, error } = await this.supabase
        .client()
        .from('projects')
        .select('*, project_participants!inner()')
        .eq('project_participants.user_id', session.user.id)
        .eq('project_participants.status', INVITATION_STATUS.PENDING);
      if (data) return { data: data, error: null };
      return { data: null, error: this.supabase.mapPostgrestError(error) };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Crée un projet et envoie une invitation par mail à chaque participant invité.
   *
   * @param project Données du projet à créer, y compris les emails des participants invités.
   *
   * @returns L'identifiant du projet créé, ou une erreur en cas d'échec.
   */
  async createProject(project: ProjectCreation): Promise<ServiceResponse<string>> {
    try {
      const { data, error } = await this.supabase.client().rpc('add_project', {
        p_pseudo: project.creatorPseudo,
        p_name: project.name,
        p_description: project.description || undefined,
        p_participants: project.participantsEmail,
      });
      if (data) return { data: data, error: null };
      return { data: null, error: this.supabase.mapPostgrestError(error!) };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Passe le statut du participant à un projet en 'accepted'.
   *
   * @param projectId UUID du projet.
   *
   * @returns Null, ou une erreur en cas d'échec.
   */
  async acceptProject(projectId: string): Promise<string | null> {
    try {
      const session: Session | null = await this.supabase.getSession();
      if (!session) return 'Il semble que vous ne soyez pas connectés.';

      const { error } = await this.supabase
        .client()
        .from('project_participants')
        .update({ status: INVITATION_STATUS.ACCEPTED })
        .eq('user_id', session.user.id)
        .eq('project_id', projectId);
      if (error)
        return 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.';

      return null;
    } catch {
      return 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.';
    }
  }

  /**
   * Récupère l'entité ProjectParticipant grâce aux identifiant du projet et de l'utilisateur.
   *
   * @param userId UUID de l'utilisateur.
   * @param projectId UUID du projet.
   *
   * @returns ProjectParticipant, ou une erreur en cas d'échec.
   */
  async getProjectParticipant(
    userId: string,
    projectId: string,
  ): Promise<ServiceResponse<ProjectParticipant>> {
    try {
      const { data, error } = await this.supabase
        .client()
        .from('project_participants')
        .select()
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single();

      if (error)
        return {
          data: null,
          error: this.supabase.mapPostgrestError(error),
        };
      return { data: data, error: null };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Récupère tous les participants d'un projet dont l'invitation a été acceptée.
   *
   * @param projectId UUID du projet.
   *
   * @returns Liste des ProjectParticipants, ou une erreur en cas d'échec.
   */
  async getAllParticipants(projectId: string): Promise<ServiceResponse<ProjectParticipant[]>> {
    try {
      const { data, error } = await this.supabase
        .client()
        .from('project_participants')
        .select()
        .eq('project_id', projectId)
        .eq('status', INVITATION_STATUS.ACCEPTED);

      if (error)
        return {
          data: null,
          error: this.supabase.mapPostgrestError(error),
        };
      return { data: data, error: null };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }

  /**
   * Récupère un projet, y compris ses participants et dépenses.
   *
   * @param projectId UUID du projet.
   *
   * @returns ProjectDetail, ou une erreur en cas d'échec.
   */
  async getProjectDetail(projectId: string): Promise<ServiceResponse<ProjectDetail>> {
    try {
      const { data: project, error: projectError } = await this.getProjectById(projectId);
      if (projectError)
        return {
          data: null,
          error: 'Erreur lors de la récupération du projet : ' + projectError,
        };

      const { data: participants, error: participantsError } =
        await this.getAllParticipants(projectId);
      if (participantsError)
        return {
          data: null,
          error: 'Erreur lors de la récupération des participants du projet : ' + participantsError,
        };

      const { data: expenses, error: expensesError } =
        await this.expenseService.getAllExpenses(projectId);
      if (expensesError)
        return {
          data: null,
          error: 'Erreur lors de la récupération des dépenses du projet : ' + expensesError,
        };

      return {
        data: { ...project!, participants: participants!, expenses: expenses! },
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }
}
