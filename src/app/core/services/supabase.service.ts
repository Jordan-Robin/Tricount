import { Injectable } from '@angular/core';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  PostgrestError,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '@env';
import { AuthCredentials } from '@shared/models/auth.models';
import { Database } from 'src/types/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);
  }

  client(): SupabaseClient<Database> {
    return this.supabase;
  }

  /**
   * Récupère l'utilisateur connecté au format Supabase.
   *
   * @returns Un User au format Supabase ou null si non connecté.
   */
  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  /**
   * Récupère la session de l'utiliateur connecté.
   *
   * @returns Une Session au format Supabase ou null si non connecté.
   */
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) return null;
    return data.session;
  }

  /**
   * Création d'un utilisateur via l'API Supabase.
   *
   * @param credentials E-mail et mot de passe.
   *
   * @returns L'utilisateur et la session, ou une erreur en cas d'échec.
   */
  signUp(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.supabase.auth.signUp(credentials);
  }

  /**
   * Authentification d'un utilisateur via l'API Supabase.
   * Le SDK supabase s'occupe de la gestion des tokens en cas de succès.
   *
   * @param credentials E-mail et mot de passe.
   *
   * @returns L'utilisateur et la session, ou une erreur en cas d'échec.
   */
  signIn(credentials: AuthCredentials): Promise<AuthTokenResponsePassword> {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  /**
   * Déconnexion de l'utilisateur via l'API Supabase.
   *
   * @returns Null ou une erreur en cas d'échec.
   */
  signOut(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }

  /**
   * Retourne un message personnalisée selon le code d'erreur PostgREST.
   *
   * @param error PostgrestError
   *
   * @returns Message en français correspondant à l'erreur.
   */
  mapPostgrestError(error: PostgrestError): string {
    switch (error.code) {
      case '23503':
        return 'Opération impossible : une donnée liée existe encore.';
      case '23505':
        return 'Cette entrée existe déjà.';
      case '42501':
        return "Vous n'avez pas les droits pour effectuer cette opération.";
      case 'P0001':
        return 'Modification refusée : champ protégé.';
      case 'PGRST116':
        return 'Aucun résultat trouvé ou résultat ambigu.';
      default:
        return 'Une erreur est survenue, merci de réessayer, ou contactez votre administrateur.';
    }
  }
}
