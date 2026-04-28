import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LayoutService } from '@core/services/layout.service';
import { PATHS } from 'src/app/routes.constants';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLinkWithHref],
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
      this.router.navigate([PATHS.LOGIN]);
    } catch {
      this.router.navigate([PATHS.LOGIN]);
    }
  }
}
