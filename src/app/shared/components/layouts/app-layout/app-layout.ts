import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LayoutService } from '@core/services/layout.service';
import { PATHS } from 'src/app/routes.constants';
import { Notification } from '@shared/components/notification/notification';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLink, Notification],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  protected layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly PATHS = PATHS;

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.layoutService.setNotification({
        message: 'Vous avez été déconnecté.',
        type: 'success',
      });
      this.router.navigate([PATHS.LOGIN]);
    } catch {
      this.router.navigate([PATHS.LOGIN]);
    }
  }
}
