import { Injectable } from '@angular/core';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '@env';

export interface AuthCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  signUp(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.supabase.auth.signUp(credentials);
  }

  signIn(credentials: AuthCredentials): Promise<AuthTokenResponsePassword> {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  signOut(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }
}
