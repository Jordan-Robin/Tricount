import { Injectable } from '@angular/core';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '@env';
import { AuthCredentials } from '@shared/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  /**
   * Récupère l'utilisateur connecté au format Supabase.
   *
   * @returns Un User Supabase ou null si non connecté.
   */
  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  /**
   * Récupère la session au format Supabase de l'utiliateur connecté.
   *
   * @returns Une Session Supabase ou null si non connecté.
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
   * @returns L'utilisateur et la session au format Supabase, ou une erreur en cas d'échec.
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
   * @returns L'utilisateur et la session au format Supabase, ou une erreur en cas d'échec.
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
}
