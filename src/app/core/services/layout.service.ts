import { Injectable, signal } from '@angular/core';
import { Notification } from '@shared/models/layout.models';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  /** Titre affiché dans le header, mis à jour par chaque composant de page. */
  public pageTitle = signal<string>('');

  public _notification = signal<Notification | null>(null);

  /** Notification éventuelle suite à une action et redirection. */
  public readonly notification = this._notification.asReadonly();

  /**
   * Incorpore une valeur à la propriété notification.
   *
   * @param notification Notification : message et type.
   */
  public setNotification(notification: Notification): void {
    this._notification.set(notification);
    setTimeout(() => {
      this._notification.set(null);
    }, 8000);
  }
}
