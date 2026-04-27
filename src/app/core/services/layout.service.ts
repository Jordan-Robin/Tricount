import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  /** Titre affiché dans le header, mis à jour par chaque composant de page. */
  public pageTitle = signal<string>('');
}
