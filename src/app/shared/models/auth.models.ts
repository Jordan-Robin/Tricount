import { Session, User } from '@supabase/supabase-js';

/** Identifiants à fournir pour l'inscription et la connexion. */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Résultat d'une tentative d'inscription. */
export type SignUpResponse = { user: User; error: null } | { user: null; error: string };

/** Résultat d'une tentative de connexion. */
export type SignInResponse =
  | { user: User; session: Session; error: null }
  | { user: null; session: null; error: string };
