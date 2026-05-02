import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { ServiceResponse } from '@shared/models/service.models';
import { Profile } from '@shared/models/profile.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private authService = inject(AuthService);
  private supabase = inject(SupabaseService);

  /**
   * Retourne les informations (nom, prénom, etc.) de l'utilisateur connecté.
   *
   * @returns Informations personnelles de l'utilisateur.
   */
  async getCurrentUserProfile(): Promise<ServiceResponse<Profile>> {
    try {
      const { data, error } = await this.authService.getUser();
      if (!data) return { data: null, error: error as string };

      const userId: string = data.id;
      const { data: profile, error: errorProfile } = await this.supabase
        .client()
        .from('profiles')
        .select()
        .eq('user_id', userId)
        .single();

      if (profile) return { data: profile, error: null };
      return { data: null, error: this.supabase.mapPostgrestError(errorProfile) };
    } catch {
      return {
        data: null,
        error: 'Une erreur est survenue, merci de réessayer ou contactez votre administrateur.',
      };
    }
  }
}
