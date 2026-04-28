import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Session, User } from '@supabase/supabase-js';
import { AuthCredentials, SignInResponse, SignUpResponse } from '@shared/models/auth.models';
import { ServiceResponse } from '@shared/models/service.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SupabaseService);

  /**
   * Vérifie si l'utilisateur est connecté.
   *
   * @returns true si connecté, false si non connecté.
   */
  async isLoggedIn(): Promise<boolean> {
    const session: Session | null = await this.supabase.getSession();
    return Boolean(session);
  }

  /**
   * Récupère l'utilisateur connecté du schéma auth de Supabase.
   *
   * @returns L'utilisateur créé ou une erreur en cas d'échec.
   */
  async getUser(): Promise<ServiceResponse<User>> {
    const response: User | null = await this.supabase.getUser();
    if (response) return { data: response, error: null };
    return {
      data: null,
      error: 'Erreur, merci de vous reconnectez, ou contactez votre administrateur.',
    };
  }

  /**
   * Création d'un compte.
   *
   * @param credentials E-mail et mot de passe.
   *
   * @returns L'utilisateur créé ou une erreur en cas d'échec.
   */
  async signUp(credentials: AuthCredentials): Promise<SignUpResponse> {
    const { data, error } = await this.supabase.signUp(credentials);

    // Cas 1 : la création du compte a échoué
    if (error) {
      let errorMessage: string | null = null;

      switch (error.code) {
        case 'email_exists':
        case 'user_already_exists':
          errorMessage = 'Un compte existe déjà avec cette adresse e-mail.';
          break;
        case 'weak_password':
          errorMessage = 'Le mot de passe est trop faible.';
          break;
        case 'validation_failed':
          errorMessage = "Le format de l'e-mail est incorrect.";
          break;
        case 'signup_disabled':
          errorMessage = "Les inscriptions sont désactivées. Contactez l'administrateur.";
          break;
        default:
          errorMessage =
            'Une erreur est survenue, merci de rééssayer ou contactez votre administrateur.';
      }

      return { user: null, error: errorMessage };
    }

    // Cas 2 : succès et retourne l'utilisateur créé
    return { user: data.user as User, error: null };
  }

  /**
   * Connexion avec e-mail et mot de passe.
   *
   * @param credentials E-mail et mot de passe.
   *
   * @returns L'utilisateur et la session, ou une erreur en cas d'échec.
   */
  async signIn(credentials: AuthCredentials): Promise<SignInResponse> {
    const { data, error } = await this.supabase.signIn(credentials);

    // Cas 1 : la connexion a échoué
    if (error) {
      let errorMessage: string | null = null;

      switch (error.code) {
        case 'invalid_credentials':
          errorMessage = "L'e-mail ou le mot de passe sont incorrects.";
          break;
        case 'email_not_confirmed':
          errorMessage = 'Connexion impossible : e-mail non confirmé.';
          break;
        case 'user_banned':
          errorMessage = 'Connexion impossible : compte banni.';
          break;
        default:
          errorMessage =
            'Une erreur est survenue, merci de rééssayer ou contactez votre administrateur.';
      }

      return { user: null, session: null, error: errorMessage };
    }

    // Cas 2 : succès et retour d'un User et de la Session.
    return { user: data.user, session: data.session, error: null };
  }

  /**
   * Déconnecte l'utilisateur.
   */
  async signOut(): Promise<void> {
    await this.supabase.signOut();
  }
}
